import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { requireSameArtifact } from './wordpress-artifact.mjs';

async function fixture(t, contents) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'wp-artifact-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const files = [];
  for (const [name, content] of Object.entries(contents)) {
    await mkdir(path.dirname(path.join(directory, name)), { recursive: true });
    await writeFile(path.join(directory, name), content);
    files.push({
      path: name,
      sha256: createHash('sha256').update(content).digest('hex'),
    });
  }
  await writeFile(
    path.join(directory, 'export-manifest.json'),
    JSON.stringify({ files }),
  );
  return directory;
}

test('fresh WordPress export can match a reviewed export in a different file order', async (t) => {
  const a = await fixture(t, { 'apps/index.html': 'page', 'style.css': 'css' });
  const b = await fixture(t, { 'style.css': 'css', 'apps/index.html': 'page' });
  assert.equal(await requireSameArtifact(a, b), 2);
});

test('valid hashes cannot hide HTML or asset changes absent from WordPress', async (t) => {
  const original = { 'apps/index.html': 'page', 'style.css': 'css' };
  const a = await fixture(t, original);
  for (const file of Object.keys(original)) {
    const b = await fixture(t, { ...original, [file]: 'changed' });
    await assert.rejects(
      requireSameArtifact(a, b),
      /WordPressと公開候補が一致しません/,
    );
  }
});

test('adding or removing a published page must match the WordPress origin', async (t) => {
  const a = await fixture(t, { 'apps/index.html': 'page' });
  const b = await fixture(t, {
    'apps/index.html': 'page',
    'apps/new.html': 'new',
  });
  await assert.rejects(requireSameArtifact(a, b), /apps\/new.html/);
  await assert.rejects(requireSameArtifact(b, a), /apps\/new.html/);
});

test('tampered payloads fail even when both manifests claim the same hash', async (t) => {
  const a = await fixture(t, { 'apps/index.html': 'page' });
  const b = await fixture(t, { 'apps/index.html': 'page' });
  await writeFile(path.join(b, 'apps/index.html'), 'tampered');
  await assert.rejects(requireSameArtifact(a, b), /Changed artifact/);
});
