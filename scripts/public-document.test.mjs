import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { localizedAppRoute, migrateLegacyAppRoute } from '../lib/app-routes.ts';
import {
  publicBody,
  parsePublicDocument,
  publicLink,
  inlineTokens,
} from '../lib/public-document.ts';

test('new and legacy app links reach one namespace without consuming unrelated paths', () => {
  assert.equal(localizedAppRoute('ja'), '/apps/');
  assert.equal(localizedAppRoute('en'), '/apps/en/');
  assert.equal(
    localizedAppRoute('en', '/apps/feedback/tsutawaru-moji/'),
    '/apps/en/feedback/tsutawaru-moji/',
  );
  for (const [before, after] of [
    ['/', '/apps/'],
    ['/en/', '/apps/en/'],
    ['/en/apps/tsutawaru-moji/', '/apps/en/tsutawaru-moji/'],
    ['/feedback/tsutawaru-moji/', '/apps/feedback/tsutawaru-moji/'],
    ['/en/privacy/location-logger/', '/apps/en/privacy/location-logger/'],
    ['/apps/contact/', '/apps/contact/'],
    ['/apps/en/contact/', '/apps/en/contact/'],
    ['/blog/hobby/', '/blog/hobby/'],
    ['/images/icon.png', '/images/icon.png'],
  ])
    assert.equal(migrateLegacyAppRoute(before), after);
  assert.equal(
    publicLink('https://aaa3710.github.io/apps/en/support/tsutawaru-moji/'),
    '/apps/en/support/tsutawaru-moji/',
  );
});

test('release-control comments are removed, never rendered as hidden HTML', () => {
  assert.equal(
    publicBody('<!-- private release checklist -->\n# Public\n\nText'),
    '# Public\n\nText',
  );
});
test('public parser preserves headings, paragraphs, lists, and inline formatting', () => {
  const document = parsePublicDocument(
    '# Title\n\nIntro\n\n## Section\n\n1. First\n2. Second\n\n### Detail\n\n- Item',
  );
  assert.equal(document.title, 'Title');
  assert.deepEqual(document.sections[0].blocks[0], {
    kind: 'list',
    ordered: true,
    items: ['First', 'Second'],
  });
  assert.equal(document.sections[0].blocks[1].kind, 'subheading');
  assert.equal(
    inlineTokens(
      'Read `Settings` and [Support](https://aaa3710.github.io/en/support/tsutawaru-moji/).',
    )[3].href,
    '/apps/en/support/tsutawaru-moji/',
  );
});
test('unsupported public markup and unresolved values fail closed', () => {
  for (const value of [
    '{{CONTACT}}',
    '<iframe src="x">',
    '<!-- another comment -->',
    '![capture](x)',
    '```js\ncode\n```',
    '| table |',
  ]) {
    assert.throws(() => parsePublicDocument(`# Title\n\n${value}`));
  }
});
test('only reviewed HTTPS destinations are permitted and local routes stay local', () => {
  assert.equal(
    publicLink('https://aaa3710.github.io/contact/'),
    '/apps/contact/',
  );
  assert.equal(
    publicLink('https://developers.openai.com/api/docs/guides/your-data'),
    'https://developers.openai.com/api/docs/guides/your-data',
  );
  for (const url of [
    'javascript:alert(1)',
    'http://aaa3710.github.io/contact/',
    'https://user:secret@help.openai.com/',
    'https://evil.invalid/',
    'https://docs.google.com/forms/x',
    'https://aaa3710.github.io/contact/?audio=secret',
  ])
    assert.throws(() => publicLink(url));
});
test('the four committed public snapshots contain no management preface or placeholder', async () => {
  const snapshot = JSON.parse(
    await readFile(
      new URL('../lib/tsutawaru-public.generated.json', import.meta.url),
      'utf8',
    ),
  );
  assert.match(snapshot.sourceCommit, /^[a-f0-9]{40}$/);
  for (const locale of ['ja', 'en'])
    for (const kind of ['support', 'privacy']) {
      const record = snapshot.documents[locale][kind];
      assert.ok(
        record.body.includes(locale === 'ja' ? '18歳未満' : 'Anyone under 18'),
      );
      assert.ok(
        record.body.includes(
          locale === 'ja'
            ? '13歳未満の子どもの音声その他の個人情報を送らない'
            : 'Do not send audio or other personal information of children under 13',
        ),
      );
      assert.ok(
        record.body.includes(
          locale === 'ja'
            ? '大人が録音する場合も同じ'
            : 'including recordings made by an adult',
        ),
      );
      assert.match(record.sha256, /^[a-f0-9]{64}$/);
      assert.doesNotMatch(
        record.body,
        /公開管理|Release control|\{\{|<!--|90日|90 days/,
      );
      const document = parsePublicDocument(record.body);
      assert.ok(document.sections.length >= 10);
      for (const block of [
        ...document.introduction,
        ...document.sections.flatMap((section) => section.blocks),
      ]) {
        for (const text of block.kind === 'list' ? block.items : [block.text])
          inlineTokens(text);
      }
    }
});
test('Tsutawaru has no form URL or readiness environment override', async () => {
  const config = await readFile(
    new URL('../lib/tsutawaru.ts', import.meta.url),
    'utf8',
  );
  const component = await readFile(
    new URL('../components/tsutawaru-page.tsx', import.meta.url),
    'utf8',
  );
  assert.match(config, /feedbackReady: false/);
  assert.doesNotMatch(
    config + component,
    /process\.env|NEXT_PUBLIC_.*READY|docs\.google\.com\/forms|<iframe|<form\b|mailto:/,
  );
});
