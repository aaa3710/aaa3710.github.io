import type { Metadata } from 'next';
import { absoluteSiteUrl, type Locale } from './site';

export const locationLogger = {
  slug: 'location-logger',
  name: { ja: 'LocationLogger', en: 'LocationLogger' },
  feedbackReady: false,
} as const;

export const locationLoggerPaths = {
  app: '/apps/location-logger/',
  support: '/support/location-logger/',
  privacy: '/privacy/location-logger/',
  feedback: '/feedback/location-logger/',
} as const;

export type LocationLoggerPageKind = keyof typeof locationLoggerPaths;

export function locationLoggerMetadata(
  locale: Locale,
  kind: LocationLoggerPageKind,
): Metadata {
  const label = {
    ja: {
      app: 'iPhoneとApple Watchの位置記録',
      support: 'サポート',
      privacy: 'プライバシー',
      feedback: 'フィードバック',
    },
    en: {
      app: 'Private iPhone and Watch location log',
      support: 'Support',
      privacy: 'Privacy',
      feedback: 'Feedback',
    },
  }[locale][kind];
  const title = `${locationLogger.name[locale]} | ${label}`;
  const description =
    locale === 'ja'
      ? 'iPhoneとApple Watchへ届いた位置を端末内へ記録するアプリ。App Store公開と問い合わせ受付は準備中です。'
      : 'An app that stores locations delivered to iPhone and Apple Watch on your devices. App Store release and support intake are being prepared.';
  if (kind === 'feedback')
    return { title, description, robots: { index: false, follow: false } };
  const localized = (language: Locale) =>
    absoluteSiteUrl(
      `${language === 'en' ? '/en' : ''}${locationLoggerPaths[kind]}`,
    );
  return {
    title,
    description,
    alternates: {
      canonical: localized(locale),
      languages: { ja: localized('ja'), en: localized('en') },
    },
    openGraph: { title, description, url: localized(locale), images: [] },
    twitter: { card: 'summary', title, description, images: [] },
  };
}
