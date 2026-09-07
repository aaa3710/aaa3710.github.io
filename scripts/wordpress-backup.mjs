import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { createReadStream } from 'node:fs';
import {
  chmod,
  copyFile,
  lstat,
  link,
  mkdir,
  mkdtemp,
  readdir,
  realpath,
  rm,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
export const PROJECT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
export const PRIVATE_ROOT = path.join(PROJECT_ROOT, 'work', 'wordpress');
export const ORIGINAL_SITE = path.join(PRIVATE_ROOT, 'site');
export const SUPPLEMENTAL_FILES = [
  'images/focus-exposure-calculator/og-ja.png',
  'images/focus-exposure-calculator/og-en.png',
];
const CONTENT_ROOTS = [
  'wp-content/themes',
  'wp-content/plugins',
  'wp-content/mu-plugins',
  'wp-content/uploads',
];
const MAX_PAYLOAD_BYTES = 512 * 1024 * 1024;

// Studio status JSON includes a password. Never forward raw Studio stdout/stderr.
export async function quietCommand(
  command,
  args,
  label,
  maxBuffer = 16 * 1024 * 1024,
) {
  try {
    const result = await execFileAsync(command, args, {
      cwd: PROJECT_ROOT,
      encoding: 'buffer',
      maxBuffer,
      timeout: 240_000,
      env: { ...process.env, NO_COLOR: '1', CI: '1', COPYFILE_DISABLE: '1' },
    });
    return result.stdout;
  } catch (error) {
    const code =
      typeof error.code === 'number' ? `exit ${error.code}` : 'process error';
    throw new Error(
      `${label} failed (${code}). Raw output is suppressed because it may contain private site data.`,
    );
  }
}

export function studio(args, label) {
  return quietCommand(
    path.join(PROJECT_ROOT, 'scripts', 'studio.sh'),
    args,
    label,
  );
}

export async function privatePath(input) {
  const absolute = path.resolve(input);
  const root = await realpath(PRIVATE_ROOT);
  if (
    absolute !== PRIVATE_ROOT &&
    !absolute.startsWith(`${PRIVATE_ROOT}${path.sep}`)
  ) {
    throw new Error(
      'WordPress backups and restore sites must stay inside the private work/wordpress directory.',
    );
  }
  let existing = absolute;
  for (;;) {
    try {
      const resolved = await realpath(existing);
      if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
        throw new Error(
          'A private WordPress path resolves outside work/wordpress.',
        );
      }
      break;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      existing = path.dirname(existing);
    }
  }
  return absolute;
}

export async function fileDigest(file) {
  const info = await lstat(file);
  if (!info.isFile() || info.isSymbolicLink())
    throw new Error('Backup inputs must be ordinary files, without symlinks.');
  if (info.size > MAX_PAYLOAD_BYTES)
    throw new Error('Backup payload exceeds the 512 MiB supported limit.');
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return { bytes: info.size, sha256: hash.digest('hex') };
}

async function contentFiles(site) {
  const files = [];
  async function walk(relative) {
    let entries;
    try {
      entries = await readdir(path.join(site, relative), {
        withFileTypes: true,
      });
    } catch (error) {
      if (error.code === 'ENOENT') return;
      throw error;
    }
    for (const entry of entries) {
      if (['.git', 'node_modules'].includes(entry.name)) continue;
      const name = `${relative}/${entry.name}`;
      // Studio regenerates this loader for each site's private runtime path.
      // The archive retains it; the rest of must-use plugins must match exactly.
      if (name === 'wp-content/mu-plugins/99-studio-loader.php') continue;
      if (entry.isSymbolicLink())
        throw new Error(
          'Theme/plugin/upload symlinks require a separate backup adapter.',
        );
      if (entry.isDirectory()) await walk(name);
      else
        files.push({
          path: name,
          ...(await fileDigest(path.join(site, name))),
        });
    }
  }
  for (const root of CONTENT_ROOTS) await walk(root);
  return files.sort((a, b) => a.path.localeCompare(b.path, 'en'));
}

// Compare saved block content and settings, not a rendered page or a new import
// of migration seeds. Site URLs legitimately change when restoring a clone.
const EDITORIAL_PROOF_PHP = String.raw`
$urls = array_unique(array(get_option('home'), get_option('siteurl')));
$from = array(); $to = array();
foreach ($urls as $url) {
  $from[] = rtrim($url, '/'); $to[] = '{{SITE_URL}}';
  $from[] = str_replace('/', chr(92) . '/', rtrim($url, '/')); $to[] = '{{SITE_URL}}';
}
$from[] = rtrim(ABSPATH, '/'); $to[] = '{{SITE_DIR}}';
$normalize = function($value) use (&$normalize, $from, $to) {
  if (is_string($value)) return str_replace($from, $to, $value);
  if (is_array($value)) {
    if (!array_is_list($value)) ksort($value);
    foreach ($value as $key => $child) $value[$key] = $normalize($child);
  }
  return $value;
};
$types = array('page', 'post', 'attachment', 'wp_template', 'wp_template_part', 'wp_global_styles', 'wp_navigation', 'wp_block');
$posts = get_posts(array('post_type' => $types, 'post_status' => array_keys(get_post_stati()), 'numberposts' => -1, 'orderby' => 'ID', 'order' => 'ASC'));
$records = array(); $counts = array(); $published = 0;
foreach ($posts as $post) {
  $meta = get_post_meta($post->ID); unset($meta['_edit_lock']);
  $fields = array();
  foreach (array('ID','post_type','post_status','post_title','post_name','post_content','post_excerpt','post_parent','menu_order','post_password','post_author','post_modified_gmt') as $key) $fields[$key] = $post->$key;
  $terms = array();
  foreach (get_object_taxonomies($post->post_type) as $taxonomy) {
    $values = wp_get_object_terms($post->ID, $taxonomy, array('fields' => 'slugs', 'orderby' => 'slug'));
    if (is_wp_error($values)) WP_CLI::error('Could not inspect saved taxonomy data.');
    $terms[$taxonomy] = $values;
  }
  $record = $normalize(array('fields' => $fields, 'meta' => $meta, 'terms' => $terms));
  $records[] = array('id' => $post->ID, 'type' => $post->post_type, 'status' => $post->post_status, 'sha256' => hash('sha256', wp_json_encode($record)));
  $key = $post->post_type . ':' . $post->post_status;
  $counts[$key] = ($counts[$key] ?? 0) + 1;
  if ($post->post_type === 'page' && $post->post_status === 'publish' && $post->post_password === '') $published++;
}
ksort($counts);
$options = array();
foreach (array('show_on_front','page_on_front','page_for_posts','template','stylesheet','permalink_structure','WPLANG','active_plugins','site_icon','theme_mods_' . get_stylesheet()) as $name) $options[$name] = get_option($name);
$proof = array('wordpressVersion' => get_bloginfo('version'), 'publishedPages' => $published, 'counts' => $counts, 'records' => $records, 'optionsSha256' => hash('sha256', wp_json_encode($normalize($options))));
echo 'CODEX_EDITORIAL_PROOF=' . wp_json_encode($proof) . "\n";
`;

export async function inspectSite(sitePath) {
  const site = await privatePath(sitePath);
  const config = await lstat(path.join(site, 'wp-config.php'));
  if (!config.isFile() || config.isSymbolicLink())
    throw new Error(
      'An existing WordPress site with an ordinary wp-config.php is required.',
    );
  const stdout = (
    await studio(
      ['wp', 'eval', EDITORIAL_PROOF_PHP, '--path', site],
      'Inspecting saved WordPress content',
    )
  ).toString('utf8');
  const match = stdout.match(/CODEX_EDITORIAL_PROOF=(\{[^\r\n]+\})/);
  if (!match)
    throw new Error(
      'Studio did not return the expected private content proof.',
    );
  const editorial = JSON.parse(match[1]);
  if (
    !Array.isArray(editorial.records) ||
    !Number.isInteger(editorial.publishedPages)
  )
    throw new Error('Invalid WordPress content proof.');
  const supplemental = [];
  for (const file of SUPPLEMENTAL_FILES)
    supplemental.push({
      path: file,
      ...(await fileDigest(path.join(site, file))),
    });
  return { editorial, contentFiles: await contentFiles(site), supplemental };
}

export function proofSummary(proof) {
  return {
    publishedPages: proof.editorial.publishedPages,
    savedRecords: proof.editorial.records.length,
    themes: proof.contentFiles.filter((file) =>
      file.path.startsWith('wp-content/themes/'),
    ).length,
    plugins: proof.contentFiles.filter((file) =>
      file.path.startsWith('wp-content/plugins/'),
    ).length,
    mustUsePlugins: proof.contentFiles.filter((file) =>
      file.path.startsWith('wp-content/mu-plugins/'),
    ).length,
    uploads: proof.contentFiles.filter((file) =>
      file.path.startsWith('wp-content/uploads/'),
    ).length,
    supplementalImages: proof.supplemental.length,
  };
}

export async function validateWordPressZip(zip) {
  await quietCommand(
    '/usr/bin/unzip',
    ['-tq', zip],
    'Validating the Studio ZIP',
  );
  const names = (
    await quietCommand(
      '/usr/bin/unzip',
      ['-Z1', zip],
      'Reading the Studio ZIP structure',
    )
  )
    .toString('utf8')
    .trim()
    .split('\n');
  if (
    !names.includes('wp-config.php') ||
    !names.some((name) => name.startsWith('sql/') && name.endsWith('.sql')) ||
    !names.some((name) => name.startsWith('wp-content/themes/'))
  ) {
    throw new Error(
      'The Studio ZIP is missing configuration, database, or theme content.',
    );
  }
  if (
    names.some(
      (name) =>
        name.startsWith('/') ||
        name.split('/').includes('..') ||
        name.includes('\\'),
    )
  )
    throw new Error('The Studio ZIP contains an unsafe path.');
}

export async function backupWordPress({ sitePath = ORIGINAL_SITE, output }) {
  const site = await realpath(await privatePath(sitePath));
  const destination = await privatePath(output);
  if (!destination.endsWith('.tar.gz'))
    throw new Error('The complete backup must use the .tar.gz extension.');
  if (destination.startsWith(`${site}${path.sep}`))
    throw new Error('Store backups outside the WordPress site directory.');
  try {
    await lstat(destination);
    throw new Error(
      'The backup already exists; existing backups are never overwritten.',
    );
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  await mkdir(path.dirname(destination), { recursive: true, mode: 0o700 });
  const stage = await mkdtemp(
    path.join(path.dirname(destination), '.wordpress-backup-'),
  );
  try {
    const before = await inspectSite(site);
    const wordpressZip = path.join(stage, 'wordpress.zip');
    await studio(
      ['export', wordpressZip, '--path', site, '--mode', 'full'],
      'Exporting the full WordPress site',
    );
    await chmod(wordpressZip, 0o600);
    await validateWordPressZip(wordpressZip);
    for (const file of before.supplemental) {
      const target = path.join(stage, 'supplemental', file.path);
      await mkdir(path.dirname(target), { recursive: true, mode: 0o700 });
      await copyFile(path.join(site, file.path), target);
      await chmod(target, 0o600);
    }
    const after = await inspectSite(site);
    if (JSON.stringify(before) !== JSON.stringify(after)) {
      throw new Error(
        'Saved content or files changed during backup. Nothing was published; save edits, then run a new backup.',
      );
    }
    const manifest = {
      schemaVersion: 1,
      createdAt: new Date().toISOString(),
      sourceSitePath: site,
      studioArchive: {
        path: 'wordpress.zip',
        ...(await fileDigest(wordpressZip)),
      },
      proof: before,
    };
    await writeFile(
      path.join(stage, 'backup-manifest.json'),
      `${JSON.stringify(manifest, null, 2)}\n`,
      { mode: 0o600 },
    );
    const archive = path.join(stage, 'complete.tar.gz');
    await quietCommand(
      '/usr/bin/tar',
      [
        '-czf',
        archive,
        '-C',
        stage,
        'backup-manifest.json',
        'wordpress.zip',
        'supplemental',
      ],
      'Bundling the complete private backup',
    );
    await chmod(archive, 0o600);
    await fileDigest(archive);
    // Staging is on the same filesystem. An exclusive hard link publishes the
    // complete archive atomically; cleanup leaves the destination's sole link.
    await link(archive, destination);
    await chmod(destination, 0o600);
    return {
      backup: destination,
      ...proofSummary(before),
      ...(await fileDigest(destination)),
    };
  } finally {
    await rm(stage, { recursive: true, force: true });
  }
}

export async function unpackBackup(backup, stage) {
  const archive = await privatePath(backup);
  await fileDigest(archive);
  const listed = (
    await quietCommand(
      '/usr/bin/tar',
      ['-tzf', archive],
      'Reading the complete backup',
    )
  )
    .toString('utf8')
    .trim()
    .split('\n');
  const files = [
    'backup-manifest.json',
    'wordpress.zip',
    ...SUPPLEMENTAL_FILES.map((file) => `supplemental/${file}`),
  ];
  const directories = new Set(['supplemental/']);
  for (const file of SUPPLEMENTAL_FILES) {
    let directory = `supplemental/${path.posix.dirname(file)}/`;
    while (directory.startsWith('supplemental/')) {
      directories.add(directory);
      directory = `${path.posix.dirname(directory.slice(0, -1))}/`;
    }
  }
  if (
    new Set(listed).size !== listed.length ||
    listed.some((name) => !files.includes(name) && !directories.has(name)) ||
    files.some((name) => !listed.includes(name))
  ) {
    throw new Error('Unexpected or missing entries in the complete backup.');
  }
  // Read only explicitly named members to stdout. Never extract archive paths,
  // symlinks, or permissions directly into the filesystem or the restore site.
  const rawManifest = await quietCommand(
    '/usr/bin/tar',
    ['-xOzf', archive, 'backup-manifest.json'],
    'Reading the backup manifest',
  );
  const manifest = JSON.parse(rawManifest.toString('utf8'));
  if (
    manifest.schemaVersion !== 1 ||
    manifest.studioArchive?.path !== 'wordpress.zip' ||
    !manifest.sourceSitePath ||
    !manifest.proof?.editorial ||
    !Array.isArray(manifest.proof?.contentFiles) ||
    JSON.stringify(manifest.proof?.supplemental?.map((file) => file.path)) !==
      JSON.stringify(SUPPLEMENTAL_FILES)
  ) {
    throw new Error('Unsupported or incomplete backup manifest.');
  }
  for (const item of [
    manifest.studioArchive,
    ...manifest.proof.supplemental.map((file) => ({
      ...file,
      path: `supplemental/${file.path}`,
    })),
  ]) {
    const bytes = await quietCommand(
      '/usr/bin/tar',
      ['-xOzf', archive, item.path],
      'Reading a verified backup member',
      MAX_PAYLOAD_BYTES,
    );
    if (
      bytes.length !== item.bytes ||
      createHash('sha256').update(bytes).digest('hex') !== item.sha256
    )
      throw new Error('Backup member integrity check failed.');
    const destination = path.join(stage, item.path);
    await mkdir(path.dirname(destination), { recursive: true, mode: 0o700 });
    await writeFile(destination, bytes, { mode: 0o600, flag: 'wx' });
  }
  await validateWordPressZip(path.join(stage, 'wordpress.zip'));
  return manifest;
}

export function argumentsFor(allowed) {
  const values = new Map();
  const args = process.argv.slice(2);
  for (let index = 0; index < args.length; index += 2) {
    if (
      !allowed.includes(args[index]) ||
      values.has(args[index]) ||
      !args[index + 1] ||
      args[index + 1].startsWith('--')
    )
      throw new Error(`Expected arguments: ${allowed.join(', ')}`);
    values.set(args[index], args[index + 1]);
  }
  if (allowed.some((flag) => !values.has(flag)))
    throw new Error(`Required arguments: ${allowed.join(', ')}`);
  return values;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  Promise.resolve()
    .then(async () => {
      const args = argumentsFor(['--path', '--output']);
      console.log(
        JSON.stringify(
          await backupWordPress({
            sitePath: args.get('--path'),
            output: args.get('--output'),
          }),
        ),
      );
    })
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
