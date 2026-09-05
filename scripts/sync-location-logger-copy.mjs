import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import {
  publicBody,
  parsePublicDocument,
  inlineTokens,
} from '../lib/public-document.ts';

const [repository, revision, mode] = process.argv.slice(2);
if (
  !repository ||
  !/^[a-f0-9]{40}$/.test(revision ?? '') ||
  (mode && mode !== '--check')
) {
  throw new Error(
    'Usage: node --experimental-strip-types scripts/sync-location-logger-copy.mjs <app-repository> <full-commit> [--check]',
  );
}
const show = (file) =>
  execFileSync('git', ['-C', repository, 'show', `${revision}:${file}`], {
    encoding: 'utf8',
  });

const documents = {};
for (const locale of ['ja', 'en']) {
  documents[locale] = {};
  for (const [kind, filename] of [
    ['app', 'AppStoreMetadata'],
    ['support', 'Support'],
    ['privacy', 'PrivacyPolicy'],
  ]) {
    const file = `Docs/${filename}-${locale}.md`;
    const source = show(file);
    const body = publicBody(source);
    const parsed = parsePublicDocument(body);
    for (const block of [
      ...parsed.introduction,
      ...parsed.sections.flatMap((section) => section.blocks),
    ]) {
      for (const text of block.kind === 'list' ? block.items : [block.text])
        inlineTokens(text);
    }
    documents[locale][kind] = {
      file,
      sha256: createHash('sha256').update(source).digest('hex'),
      body,
    };
  }
}

const result =
  JSON.stringify(
    {
      generated:
        'Do not edit: LocationLogger Docs is canonical. Use scripts/sync-location-logger-copy.mjs.',
      sourceRepository: 'LocationLogger',
      sourceCommit: revision,
      documents,
    },
    null,
    2,
  ) + '\n';
const output = fileURLToPath(
  new URL('../lib/location-logger-public.generated.json', import.meta.url),
);
if (mode === '--check') {
  if ((await readFile(output, 'utf8')) !== result)
    throw new Error(
      'Public snapshot differs from the selected LocationLogger commit',
    );
  console.log(
    'Six LocationLogger public originals match the committed snapshot.',
  );
} else {
  await writeFile(output, result);
  console.log('Imported six LocationLogger public originals.');
}
