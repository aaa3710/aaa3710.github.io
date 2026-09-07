import {
  chmod,
  copyFile,
  lstat,
  mkdir,
  mkdtemp,
  realpath,
  readdir,
  rm,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  argumentsFor,
  inspectSite,
  ORIGINAL_SITE,
  PRIVATE_ROOT,
  privatePath,
  proofSummary,
  studio,
  unpackBackup,
} from './wordpress-backup.mjs';

async function validateRestoreTree(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    const info = await lstat(file);
    if (info.isSymbolicLink() || (info.isFile() && info.nlink > 1)) {
      throw new Error(
        'Restore targets must not contain symlinks or hard-linked files that could modify another site.',
      );
    }
    if (info.isDirectory()) await validateRestoreTree(file);
  }
}

export async function restoreWordPress({ backup, sitePath }) {
  const site = await realpath(await privatePath(sitePath));
  let original = ORIGINAL_SITE;
  try {
    original = await realpath(ORIGINAL_SITE);
  } catch (error) {
    // Recovery into a separate site must also work after the original is lost.
    if (error.code !== 'ENOENT') throw error;
  }
  if (
    site === original ||
    site.startsWith(original + path.sep) ||
    original.startsWith(site + path.sep)
  )
    throw new Error(
      'Restoring over the editing original is prohibited. Choose a separate Studio restore-check site.',
    );
  if (site === (await realpath(PRIVATE_ROOT)))
    throw new Error(
      'Choose a WordPress site directory, not the private workspace root.',
    );
  const config = await lstat(path.join(site, 'wp-config.php'));
  if (!config.isFile() || config.isSymbolicLink())
    throw new Error(
      'Create a separate Studio site before restoring this backup.',
    );
  await validateRestoreTree(site);
  const stage = await mkdtemp(path.join(PRIVATE_ROOT, '.wordpress-restore-'));
  try {
    const manifest = await unpackBackup(backup, stage);
    let source = path.resolve(manifest.sourceSitePath);
    try {
      source = await realpath(source);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    if (
      site === source ||
      site.startsWith(source + path.sep) ||
      source.startsWith(site + path.sep)
    )
      throw new Error(
        'A backup must be restored into a different site from its source.',
      );
    // Only after the full bundle is verified may Studio replace the test site.
    await studio(
      ['import', path.join(stage, 'wordpress.zip'), '--path', site],
      'Restoring the full WordPress site',
    );
    await validateRestoreTree(site);
    for (const file of manifest.proof.supplemental) {
      const destination = await privatePath(path.join(site, file.path));
      await mkdir(path.dirname(destination), { recursive: true, mode: 0o700 });
      await copyFile(path.join(stage, 'supplemental', file.path), destination);
      await chmod(destination, 0o600);
    }
    const restored = await inspectSite(site);
    if (JSON.stringify(restored) !== JSON.stringify(manifest.proof)) {
      const differences = [];
      for (const key of ['editorial', 'contentFiles', 'supplemental']) {
        if (
          JSON.stringify(restored[key]) !== JSON.stringify(manifest.proof[key])
        )
          differences.push(key);
      }
      throw new Error(
        `Restore verification failed for: ${differences.join(', ')}. The original site was not changed; inspect only the restore-check site.`,
      );
    }
    return { restoredSite: site, verified: true, ...proofSummary(restored) };
  } finally {
    await rm(stage, { recursive: true, force: true });
  }
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  Promise.resolve()
    .then(async () => {
      const args = argumentsFor(['--backup', '--path']);
      console.log(
        JSON.stringify(
          await restoreWordPress({
            backup: args.get('--backup'),
            sitePath: args.get('--path'),
          }),
        ),
      );
    })
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
