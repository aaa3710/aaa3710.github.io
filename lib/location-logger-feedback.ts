import { contactFormUrl, feedbackFormUrl } from './feedback.ts';
import type { Locale } from './site.ts';

type PublicEnvironment = Record<string, string | undefined>;

export type LocationLoggerFeedbackConfig = {
  ready: boolean;
  urls: Record<Locale, string | null>;
};

const keys = {
  ready: 'NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_READY',
  ja: 'NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_URL_JA',
  en: 'NEXT_PUBLIC_LOCATION_LOGGER_FEEDBACK_URL_EN',
} as const;

function normalizedResponderUrl(value: string | undefined) {
  const raw = value?.trim();
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (
    url.protocol !== 'https:' ||
    url.hostname !== 'docs.google.com' ||
    url.port ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    !/^\/forms\/d\/e\/[A-Za-z0-9_-]+\/viewform\/?$/.test(url.pathname)
  )
    return null;
  url.pathname = url.pathname.replace(/\/$/, '');
  return url.href;
}

const reservedResponderUrls = new Set(
  (['ja', 'en'] as const).flatMap((locale) => [
    normalizedResponderUrl(feedbackFormUrl(locale)),
    normalizedResponderUrl(contactFormUrl(locale)),
  ]),
);

export function resolveLocationLoggerFeedbackConfig(
  environment: PublicEnvironment,
): LocationLoggerFeedbackConfig {
  if (environment[keys.ready] !== 'true')
    return { ready: false, urls: { ja: null, en: null } };

  const ja = normalizedResponderUrl(environment[keys.ja]);
  const en = normalizedResponderUrl(environment[keys.en]);
  if (!ja || !en)
    throw new Error(
      `${keys.ready}=true requires valid ${keys.ja} and ${keys.en} responder URLs.`,
    );
  if (ja === en)
    throw new Error('LocationLogger Feedback requires different ja/en forms.');
  if (reservedResponderUrls.has(ja) || reservedResponderUrls.has(en))
    throw new Error(
      'LocationLogger Feedback must not reuse Focus or Contact forms.',
    );
  return { ready: true, urls: { ja, en } };
}

export const locationLoggerFeedbackConfig = resolveLocationLoggerFeedbackConfig(
  process.env,
);

export function locationLoggerFeedbackUrl(
  locale: Locale,
  embedded = false,
  config = locationLoggerFeedbackConfig,
) {
  const url = config.ready ? config.urls[locale] : null;
  if (!url) return null;
  return embedded ? `${url}?embedded=true` : url;
}
