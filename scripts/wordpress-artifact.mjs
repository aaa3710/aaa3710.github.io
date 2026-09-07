import { createHash } from 'node:crypto';
import { access, cp, mkdir, readFile, readdir, rename } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
export async function verifyArtifact(directory) {
  const manifest = JSON.parse(
    await readFile(path.join(directory, 'export-manifest.json'), 'utf8'),
  );
  const entries = manifest.files;
  if (!Array.isArray(entries) || !entries.length)
    throw new Error('Missing public artifact manifest');
  for (const file of entries) {
    if (
      file.path.startsWith('/') ||
      file.path.split('/').some((p) => p === '..')
    )
      throw new Error('Invalid artifact path');
    const bytes = await readFile(path.join(directory, file.path));
    if (createHash('sha256').update(bytes).digest('hex') !== file.sha256)
      throw new Error(`Changed artifact: ${file.path}`);
  }
  async function list(dir) {
    return (
      await Promise.all(
        (
          await readdir(dir, { withFileTypes: true })
        ).map((e) =>
          e.isDirectory()
            ? list(path.join(dir, e.name))
            : [path.relative(directory, path.join(dir, e.name))],
        ),
      )
    ).flat();
  }
  const expected = new Set([
    ...entries.map((f) => f.path),
    'export-manifest.json',
  ]);
  const actual = await list(directory);
  if (actual.length !== expected.size || actual.some((f) => !expected.has(f)))
    throw new Error('Unlisted files in public artifact');
  return manifest;
}
export async function replaceArtifact(source, target) {
  await verifyArtifact(source);
  try {
    await access(target);
    await verifyArtifact(target);
    const history = path.join(root, 'work/wordpress/artifact-history');
    await mkdir(history, { recursive: true });
    await rename(
      target,
      path.join(history, Date.now() + '-' + path.basename(target)),
    );
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  await cp(source, target, { recursive: true });
  await verifyArtifact(target);
}
