import path from 'node:path';
import { cp, mkdir, access } from 'node:fs/promises';
import { verifyArtifact } from './wordpress-artifact.mjs';
const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'site-output');
await verifyArtifact(source);
// dist/client is disposable build output. Preserve the previous build for this run.
await mkdir(path.join(root, 'dist'), { recursive: true });
const { rename } = await import('node:fs/promises');
try {
  await access(path.join(root, 'dist/client'));
  await rename(
    path.join(root, 'dist/client'),
    path.join(root, 'dist', 'previous-client-' + Date.now()),
  );
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
await cp(source, path.join(root, 'dist/client'), { recursive: true });
await verifyArtifact(path.join(root, 'dist/client'));
console.log(
  'Built the verified WordPress snapshot without regenerating its content.',
);
