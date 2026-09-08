import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  INTAKE_POLICY_FILE,
  normalizeIntakePolicy,
  intakeUrlForRoute,
  validateIntakeMarkup,
} from './wordpress-intakes.mjs';
import { requireSameArtifact } from './wordpress-artifact.mjs';

const url = (suffix) =>
  `https://docs.google.com/forms/d/e/SYNTHETIC_NOT_A_LIVE_FORM_${suffix}/viewform`;
const policy = () => ({
  version: 1,
  intakes: [
    {
      kind: 'feedback',
      app: 'location-logger',
      verified: true,
      urls: { ja: url('JA'), en: url('EN') },
    },
  ],
});

test('intake defaults are closed and only exact page/language bindings are returned', () => {
  assert.deepEqual(normalizeIntakePolicy(), { version: 1, intakes: [] });
  const value = normalizeIntakePolicy(policy());
  assert.equal(
    intakeUrlForRoute(value, '/apps/feedback/location-logger/'),
    url('JA'),
  );
  assert.equal(
    intakeUrlForRoute(value, '/apps/en/feedback/location-logger/'),
    url('EN'),
  );
  for (const route of [
    '/apps/contact/',
    '/apps/feedback/focus-exposure-calculator/',
    '/apps/location-logger/',
  ]) {
    assert.equal(intakeUrlForRoute(value, route), null);
  }
});

test('unverified, incomplete, duplicated, cross-purpose and non-responder configuration is rejected', () => {
  const mutations = [
    (p) => {
      p.version = true;
    },
    (p) => {
      p.secret = 'synthetic';
    },
    (p) => {
      p.intakes[0].verified = false;
    },
    (p) => {
      p.intakes[0].verified = 'true';
    },
    (p) => {
      p.intakes[0].app = 'unregistered-app';
    },
    (p) => {
      p.intakes[0].kind = 'contact';
    },
    (p) => {
      delete p.intakes[0].urls.en;
    },
    (p) => {
      p.intakes[0].urls.en = p.intakes[0].urls.ja;
    },
    (p) => {
      p.intakes.push(structuredClone(p.intakes[0]));
    },
    (p) => {
      p.intakes.push({
        kind: 'contact',
        app: null,
        verified: true,
        urls: p.intakes[0].urls,
      });
    },
  ];
  for (const mutate of mutations) {
    const value = policy();
    mutate(value);
    assert.throws(() => normalizeIntakePolicy(value), /WordPress intake:/);
  }
  for (const invalid of [
    'https://forms.gle/synthetic',
    'https://example.invalid/form',
    url('JA').replace('https:', 'http:'),
    url('JA').replace('/viewform', '/edit'),
    url('JA') + '?embedded=true',
    url('JA') + '#section',
    url('JA').replace('docs.google.com', 'docs.google.com.example.invalid'),
    url('JA').replace('/forms/', '/%66orms/'),
    url('JA').replace('https://', 'https://user:secret@'),
  ]) {
    const value = policy();
    value.intakes[0].urls.ja = invalid;
    assert.throws(() => normalizeIntakePolicy(value), /responder URL/);
  }
});

test('HTML cannot move a verified form to another language, app or Contact page', () => {
  const value = normalizeIntakePolicy(policy());
  const route = '/apps/feedback/location-logger/';
  const link = `<a href="${url('JA')}">Open the form</a>`;
  validateIntakeMarkup(link, route, value);
  for (const wrong of [
    '/apps/en/feedback/location-logger/',
    '/apps/contact/',
    '/apps/feedback/focus-exposure-calculator/',
  ]) {
    assert.throws(
      () => validateIntakeMarkup(link, wrong, value),
      /does not match/,
    );
  }
  for (const html of [
    '',
    link + link,
    `<a href="${url('EN')}">Wrong language</a>`,
    `<a href="${url('JA').replace('/forms/', '/%66orms/')}">Encoded</a>`,
    `<iframe src="${url('JA')}"></iframe>`,
    '<form><textarea></textarea></form>',
  ]) {
    assert.throws(
      () => validateIntakeMarkup(html, route, value),
      /WordPress intake:/,
    );
  }
  assert.throws(
    () => validateIntakeMarkup(link, route, normalizeIntakePolicy()),
    /disabled/,
  );
  assert.throws(
    () =>
      validateIntakeMarkup(
        link.replace('https:', ''),
        route,
        normalizeIntakePolicy(),
      ),
    /disabled/,
  );
});

async function copySnapshot(t) {
  const directory = await mkdtemp(
    path.join(os.tmpdir(), 'wordpress-intake-policy-'),
  );
  t.after(() => rm(directory, { recursive: true, force: true }));
  await cp(path.resolve(import.meta.dirname, '../site-output'), directory, {
    recursive: true,
  });
  // Normalize only temporary copies so the checks remain independent of which
  // intakes the adopted snapshot currently enables.
  const manifestPath = path.join(directory, 'export-manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  for (const entry of manifest.files) {
    if (
      !/^apps\/(?:en\/)?(?:feedback\/[^/]+|contact)(?:\/index)?\.html$/.test(
        entry.path,
      )
    )
      continue;
    const filename = path.join(directory, entry.path);
    let html = await readFile(filename, 'utf8');
    html = html.replace(
      /<a\b[^>]*href=["']https:\/\/docs\.google\.com\/forms\/[^"']+["'][^>]*>[\s\S]*?<\/a>/gi,
      '',
    );
    const english = entry.path.startsWith('apps/en/');
    html = html.replace(
      '</main>',
      `<p>${english ? 'Submissions are not available yet. The form is being prepared.' : '現在は送信できません。フォームは準備中です。'}</p></main>`,
    );
    await writeFile(filename, html);
    entry.bytes = Buffer.byteLength(html);
    entry.sha256 = createHash('sha256').update(html).digest('hex');
  }
  await writeFile(manifestPath, JSON.stringify(manifest));
  return directory;
}

async function savePolicy(directory, value) {
  const manifestPath = path.join(directory, 'export-manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const content = JSON.stringify(normalizeIntakePolicy(value), null, 2) + '\n';
  await writeFile(path.join(directory, INTAKE_POLICY_FILE), content);
  manifest.files = manifest.files.filter(
    (file) => file.path !== INTAKE_POLICY_FILE,
  );
  manifest.files.push({
    path: INTAKE_POLICY_FILE,
    bytes: Buffer.byteLength(content),
    sha256: createHash('sha256').update(content).digest('hex'),
  });
  await writeFile(manifestPath, JSON.stringify(manifest));
}

function verify(directory, flags) {
  return spawnSync(
    process.execPath,
    [path.join(import.meta.dirname, 'verify-pages.mjs')],
    {
      cwd: path.resolve(import.meta.dirname, '..'),
      encoding: 'utf8',
      env: {
        ...process.env,
        STATIC_SITE_DIRECTORY: directory,
        NEXT_PUBLIC_SUPPORT_EMAIL: '',
        NEXT_PUBLIC_SITE_ORIGIN: 'https://aaa3710.github.io',
        NEXT_PUBLIC_BASE_PATH: '',
        NEXT_PUBLIC_APP_FEEDBACK_READY: flags,
        NEXT_PUBLIC_CONTACT_READY: flags,
        NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_READY: flags,
        NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_URL_JA: url('WRONG_JA'),
        NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_URL_EN: url('WRONG_EN'),
      },
    },
  );
}

test('WordPress verification ignores legacy readiness variables and compares policy-only drift', async (t) => {
  const closed = await copySnapshot(t);
  await savePolicy(closed, { version: 1, intakes: [] });
  const checked = verify(closed, 'true');
  assert.equal(checked.status, 0, checked.stderr);
  const changed = await copySnapshot(t);
  await savePolicy(changed, policy());
  await assert.rejects(
    requireSameArtifact(closed, changed),
    /intake-policy.json/,
  );
  const missingLink = verify(changed, 'false');
  assert.notEqual(missingLink.status, 0);
  assert.match(missingLink.stderr, /exactly one matching responder link/);
});

test('a copied WP artifact with matching bilingual links verifies while environment flags stay false', async (t) => {
  const directory = await copySnapshot(t);
  await savePolicy(directory, policy());
  const manifestPath = path.join(directory, 'export-manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  for (const language of ['ja', 'en']) {
    const prefix = language === 'en' ? 'apps/en/' : 'apps/';
    for (const suffix of ['/index.html', '.html']) {
      const relative = `${prefix}feedback/location-logger${suffix}`;
      const filename = path.join(directory, relative);
      let html = await readFile(filename, 'utf8');
      html = html.replace(
        language === 'ja'
          ? '現在は送信できません'
          : 'Submissions are not available yet',
        language === 'ja'
          ? '専用フィードバックは送信できます'
          : 'Dedicated feedback is available',
      );
      html = html.replace(
        '</main>',
        `<p>${language === 'ja' ? '専用フィードバックは送信できます' : 'Dedicated feedback is available'} <a href="${url(language.toUpperCase())}">Open the form</a></p></main>`,
      );
      await writeFile(filename, html);
      const entry = manifest.files.find((file) => file.path === relative);
      entry.bytes = Buffer.byteLength(html);
      entry.sha256 = createHash('sha256').update(html).digest('hex');
    }
  }
  await writeFile(manifestPath, JSON.stringify(manifest));
  const result = verify(directory, 'false');
  assert.equal(result.status, 0, result.stderr);
});
