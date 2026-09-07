import assert from 'node:assert/strict';
import test from 'node:test';
import { contactFormUrl, feedbackFormUrl } from '../lib/feedback.ts';
import {
  locationLoggerFeedbackUrl,
  resolveLocationLoggerFeedbackConfig,
} from '../lib/location-logger-feedback.ts';

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

const locationLoggerJa =
  'https://docs.google.com/forms/d/e/LOCATION_LOGGER_JA_TEST/viewform';
const locationLoggerEn =
  'https://docs.google.com/forms/d/e/LOCATION_LOGGER_EN_TEST/viewform';

function locationLoggerEnvironment(overrides = {}) {
  return {
    NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_READY: 'true',
    NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_URL_JA: locationLoggerJa,
    NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_URL_EN: locationLoggerEn,
    ...overrides,
  };
}

test('LocationLogger Feedback stays disconnected unless exact readiness is set', () => {
  for (const ready of [undefined, '', 'false', 'TRUE', '1']) {
    const config = resolveLocationLoggerFeedbackConfig(
      locationLoggerEnvironment({
        NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_READY: ready,
        NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_URL_JA: 'not-a-url',
      }),
    );
    assert.deepEqual(config, {
      ready: false,
      urls: { ja: null, en: null },
    });
    assert.equal(locationLoggerFeedbackUrl('ja', false, config), null);
    assert.equal(locationLoggerFeedbackUrl('en', true, config), null);
  }
});

test('LocationLogger Feedback requires two distinct validated responder URLs', () => {
  for (const overrides of [
    { NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_URL_JA: undefined },
    { NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_URL_EN: undefined },
    { NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_URL_JA: 'not-a-url' },
    {
      NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_URL_JA:
        'http://docs.google.com/forms/d/e/LOCATION_LOGGER_JA_TEST/viewform',
    },
    {
      NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_URL_JA:
        'https://forms.gle/LOCATION_LOGGER_JA_TEST',
    },
    {
      NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_URL_JA: `${locationLoggerJa}?embedded=true`,
    },
    { NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_URL_EN: locationLoggerJa },
    {
      NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_URL_JA: feedbackFormUrl('ja'),
    },
    {
      NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_URL_EN: contactFormUrl('en'),
    },
  ]) {
    assert.throws(
      () =>
        resolveLocationLoggerFeedbackConfig(
          locationLoggerEnvironment(overrides),
        ),
      /LocationLogger|requires valid/,
    );
  }
});

test('LocationLogger Feedback connects only its matching localized forms', () => {
  const config = resolveLocationLoggerFeedbackConfig(
    locationLoggerEnvironment(),
  );
  assert.deepEqual(config, {
    ready: true,
    urls: { ja: locationLoggerJa, en: locationLoggerEn },
  });
  assert.equal(
    locationLoggerFeedbackUrl('ja', false, config),
    locationLoggerJa,
  );
  assert.equal(
    locationLoggerFeedbackUrl('en', true, config),
    `${locationLoggerEn}?embedded=true`,
  );
});

test('localized names and public paths share the same app identity', async () => {
  const { featuredApp, featuredAppPaths } = await readSite(undefined);
  assert.equal(featuredApp.name.ja, '撮影のものさし');
  assert.equal(featuredApp.name.en, 'Photo Yardstick');
  assert.equal(featuredApp.subtitle.ja, 'ピントと露出を計算');
  assert.equal(featuredApp.subtitle.en, 'Depth of Field & Exposure');
  for (const name of Object.values(featuredApp.name)) {
    assert.ok([...name].length <= 30);
    assert.ok(!name.includes('&amp;'));
  }
  for (const route of Object.values(featuredAppPaths)) {
    assert.ok(route.endsWith('/focus-exposure-calculator/'));
  }
});
