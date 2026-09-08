import { parse } from 'parse5';

export const INTAKE_POLICY_FILE = 'intake-policy.json';
const APPS = new Set([
  'focus-exposure-calculator',
  'location-logger',
  'tsutawaru-moji',
  'wrist-morse',
]);

function fail(message) {
  throw new Error(`WordPress intake: ${message}`);
}

function keys(value, expected) {
  return (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length === expected.length &&
    expected.every((key) => Object.hasOwn(value, key))
  );
}

// This is an owner-verified binding, not evidence about the live Google form.
export function normalizeIntakePolicy(input = { version: 1, intakes: [] }) {
  if (
    !keys(input, ['version', 'intakes']) ||
    input.version !== 1 ||
    !Array.isArray(input.intakes) ||
    input.intakes.length > APPS.size + 1
  ) {
    fail('Expected version 1 and a bounded list of verified intakes.');
  }
  const groups = new Set();
  const urls = new Set();
  const intakes = input.intakes.map((entry) => {
    if (
      !keys(entry, ['kind', 'app', 'verified', 'urls']) ||
      entry.verified !== true ||
      !keys(entry.urls, ['ja', 'en']) ||
      !(
        (entry.kind === 'contact' && entry.app === null) ||
        (entry.kind === 'feedback' && APPS.has(entry.app))
      )
    ) {
      fail(
        'Each intake requires its exact purpose, app, verified status and both languages.',
      );
    }
    const group = `${entry.kind}:${entry.app ?? ''}`;
    if (groups.has(group)) fail('Duplicate intake purpose/app.');
    groups.add(group);
    const checked = {};
    for (const language of ['ja', 'en']) {
      const url = entry.urls[language];
      if (
        typeof url !== 'string' ||
        !/^https:\/\/docs\.google\.com\/forms\/d\/e\/[A-Za-z0-9_-]{16,256}\/viewform$/.test(
          url,
        )
      ) {
        fail(
          'Only exact HTTPS Google Forms responder URLs without queries are accepted.',
        );
      }
      if (urls.has(url))
        fail('A form must not be shared across languages, apps or purposes.');
      urls.add(url);
      checked[language] = url;
    }
    return { kind: entry.kind, app: entry.app, verified: true, urls: checked };
  });
  intakes.sort((a, b) =>
    `${a.kind}:${a.app}`.localeCompare(`${b.kind}:${b.app}`, 'en'),
  );
  return { version: 1, intakes };
}

export function intakeRoute(entry, language) {
  const prefix = language === 'en' ? '/apps/en/' : '/apps/';
  return entry.kind === 'contact'
    ? `${prefix}contact/`
    : `${prefix}feedback/${entry.app}/`;
}

export function intakeUrlForRoute(policy, route) {
  for (const entry of policy.intakes) {
    for (const language of ['ja', 'en']) {
      if (intakeRoute(entry, language) === route) return entry.urls[language];
    }
  }
  return null;
}

export function isGoogleFormsUrl(value) {
  try {
    const url = new URL(value, 'https://invalid.example/');
    return (
      ['forms.gle', 'forms.google.com'].includes(url.hostname) ||
      (url.hostname === 'docs.google.com' &&
        /^\/forms(?:\/|$)/.test(decodeURIComponent(url.pathname)))
    );
  } catch {
    return false;
  }
}

// No external request is made here. A configured page must contain exactly its
// approved link; all other forms and embedded input UI remain disabled.
export function validateIntakeMarkup(source, route, policy) {
  const expected = intakeUrlForRoute(policy, route);
  let matches = 0;
  function visit(node) {
    if (
      ['form', 'input', 'textarea', 'iframe', 'object', 'embed'].includes(
        node.tagName,
      )
    ) {
      fail(
        'Only a separate-page responder link is supported, not embedded input UI.',
      );
    }
    if (['a', 'area'].includes(node.tagName)) {
      const href = node.attrs?.find((item) => item.name === 'href')?.value;
      if (href && isGoogleFormsUrl(href)) {
        if (!expected || href !== expected) {
          fail(
            'Google Forms intake is disabled or does not match this page and language.',
          );
        }
        matches += 1;
      }
    }
    for (const child of node.childNodes ?? []) visit(child);
    if (node.content) visit(node.content);
  }
  visit(parse(source));
  if (expected && matches !== 1)
    fail(
      'A verified intake page must contain exactly one matching responder link.',
    );
}
