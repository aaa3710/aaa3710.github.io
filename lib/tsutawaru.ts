import { localizedAppRoute } from '@/lib/app-routes';
import type { Metadata } from 'next';
import { absoluteSiteUrl, type Locale } from './site';

export const tsutawaru = {
  slug: 'tsutawaru-moji',
  name: { ja: '伝わる文字', en: 'Tsutawaru Moji' },
  // No registered form, URL, or environment override exists for this app.
  feedbackReady: false,
} as const;
export const tsutawaruPaths = {
  app: '/apps/tsutawaru-moji/',
  support: '/apps/support/tsutawaru-moji/',
  privacy: '/apps/privacy/tsutawaru-moji/',
  feedback: '/apps/feedback/tsutawaru-moji/',
} as const;
export type TsutawaruPageKind = keyof typeof tsutawaruPaths;

export function tsutawaruMetadata(
  locale: Locale,
  kind: TsutawaruPageKind,
): Metadata {
  const label = {
    ja: {
      app: '会話を読みやすい文字に',
      support: 'サポート',
      privacy: 'プライバシー',
      feedback: 'フィードバック',
    },
    en: {
      app: 'Readable text for face-to-face conversations',
      support: 'Support',
      privacy: 'Privacy',
      feedback: 'Feedback',
    },
  }[locale][kind];
  const title = `${tsutawaru.name[locale]} | ${label}`;
  const description =
    locale === 'ja'
      ? '対面の会話を大きな文字で表示するiPhoneアプリ。App Store公開準備中です。問い合わせ受付は準備中で、現在は送信できません。'
      : 'An iPhone app that displays face-to-face conversations as large text. App Store release and support intake are being prepared; submissions are not available yet.';
  if (kind === 'feedback')
    return { title, description, robots: { index: false, follow: false } };
  const localized = (language: Locale) =>
    absoluteSiteUrl(localizedAppRoute(language, tsutawaruPaths[kind]));
  return {
    title,
    description,
    alternates: {
      canonical: localized(locale),
      languages: { ja: localized('ja'), en: localized('en') },
    },
    openGraph: { title, description, url: localized(locale) },
    twitter: { card: 'summary', title, description },
  };
}
