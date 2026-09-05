import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  publicBody,
  parsePublicDocument,
  publicLink,
  inlineTokens,
} from '../lib/public-document.ts';

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
    '/en/support/tsutawaru-moji/',
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
  assert.equal(publicLink('https://aaa3710.github.io/contact/'), '/contact/');
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

test('LocationLogger snapshots preserve the current privacy and support boundaries', async () => {
  const snapshot = JSON.parse(
    await readFile(
      new URL('../lib/location-logger-public.generated.json', import.meta.url),
      'utf8',
    ),
  );
  for (const locale of ['ja', 'en'])
    for (const kind of ['app', 'support', 'privacy']) {
      const record = snapshot.documents[locale][kind];
      assert.match(record.sha256, /^[a-f0-9]{64}$/);
      assert.doesNotMatch(
        record.body,
        /\{\{|<!--|mailto:|docs\.google\.com\/forms|forms\.gle/,
      );
      const document = parsePublicDocument(record.body);
      assert.ok(document.sections.length >= 2);
    }
  const ja = snapshot.documents.ja;
  const en = snapshot.documents.en;
  assert.match(ja.privacy.body, /アプリ内の一括削除操作はありません/);
  assert.match(en.privacy.body, /no in-app bulk deletion control/);
  assert.match(ja.privacy.body, /本人認証が必要/);
  assert.match(en.privacy.body, /Shortcuts require authentication/);
  assert.match(ja.privacy.body, /OSバックアップの対象外/);
  assert.match(en.privacy.body, /excluded from operating-system backups/);
  assert.match(ja.app.body, /Apple地図を併記/);
  assert.match(en.app.body, /corresponding Apple map/);
});

test('LocationLogger Feedback uses its dedicated fail-closed configuration', async () => {
  const config = await readFile(
    new URL('../lib/location-logger.ts', import.meta.url),
    'utf8',
  );
  const feedbackConfig = await readFile(
    new URL('../lib/location-logger-feedback.ts', import.meta.url),
    'utf8',
  );
  const component = await readFile(
    new URL('../components/location-logger-page.tsx', import.meta.url),
    'utf8',
  );
  assert.match(config, /feedbackReady: locationLoggerFeedbackConfig\.ready/);
  assert.match(feedbackConfig, /NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_READY/);
  assert.match(component, /locationLoggerFeedbackUrl/);
  assert.doesNotMatch(
    config + feedbackConfig + component,
    /LOCATION_LOGGER_(?:JA|EN)_TEST|1FAIpQL[^'"\s]+|mailto:/,
  );
});
