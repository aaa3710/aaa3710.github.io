import assert from 'node:assert/strict';
import test from 'node:test';

let importVersion = 0;

async function readSite(email) {
  if (email === undefined) delete process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  else process.env.NEXT_PUBLIC_SUPPORT_EMAIL = email;
  return import(`../lib/site.ts?test=${importVersion++}`);
}

async function readForms(feedback, contact) {
  delete process.env.NEXT_PUBLIC_APP_FEEDBACK_READY;
  delete process.env.NEXT_PUBLIC_CONTACT_READY;
  if (feedback !== undefined) {
    process.env.NEXT_PUBLIC_APP_FEEDBACK_READY = feedback;
  }
  if (contact !== undefined) process.env.NEXT_PUBLIC_CONTACT_READY = contact;
  return import(`../lib/feedback.ts?test=${importVersion++}`);
}

test('no public email is emitted when unset or blank', async () => {
  for (const value of [undefined, '', '  ']) {
    assert.equal((await readSite(value)).publicSupportEmail, null);
  }
});

test('a configured public email is trimmed without a fallback address', async () => {
  // Reserved domain, used only inside this test, never as a site default.
  assert.equal(
    (await readSite('  support+apps@example.invalid  ')).publicSupportEmail,
    'support+apps@example.invalid',
  );
});

test('invalid or mailto-injection-like email values fail closed', async () => {
  for (const value of [
    'not-an-email',
    'a@b.invalid?subject=test',
    'a@b.invalid#fragment',
    'a@b.invalid\nBcc:test',
    'a@b..invalid',
  ]) {
    await assert.rejects(readSite(value), /NEXT_PUBLIC_SUPPORT_EMAIL/);
  }
});

test('unconfirmed forms stay unavailable by default', async () => {
  for (const values of [
    [undefined, undefined],
    ['', ''],
    ['false', 'false'],
    ['TRUE', '1'],
  ]) {
    assert.deepEqual((await readForms(...values)).formReadiness, {
      contact: false,
      'app-feedback': false,
    });
  }
});

test('form readiness is independent and requires the exact true value', async () => {
  assert.deepEqual((await readForms('true', undefined)).formReadiness, {
    contact: false,
    'app-feedback': true,
  });
  assert.deepEqual((await readForms(undefined, 'true')).formReadiness, {
    contact: true,
    'app-feedback': false,
  });
});

test('localized names and public paths share the same app identity', async () => {
  const { featuredApp, featuredAppPaths } = await readSite(undefined);
  assert.equal(featuredApp.name.ja, '撮影のものさし');
  assert.equal(featuredApp.name.en, 'Photo Yardstick');
  for (const name of Object.values(featuredApp.name)) {
    assert.ok([...name].length <= 30);
    assert.ok(!name.includes('&amp;'));
  }
  for (const route of Object.values(featuredAppPaths)) {
    assert.ok(route.endsWith('/focus-exposure-calculator/'));
  }
});
