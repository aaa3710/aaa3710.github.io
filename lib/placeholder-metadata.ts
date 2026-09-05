import { localizedAppRoute } from '@/lib/app-routes';
import type { Metadata } from 'next';
import { absoluteSiteUrl, type Locale } from '@/lib/site';

export function placeholderMetadata(
  locale: Locale,
  slug: string,
  name: string,
): Metadata {
  const isEnglish = locale === 'en';

  return {
    title: `${name} — ${isEnglish ? 'Introduction in progress' : '紹介ページ準備中'}`,
    description: isEnglish
      ? `The public page for ${name} is being prepared.`
      : `${name}の公開内容を準備しています。`,
    robots: { index: false, follow: true },
    alternates: {
      canonical: absoluteSiteUrl(localizedAppRoute(locale, `/apps/${slug}/`)),
      languages: {
        ja: absoluteSiteUrl(`/apps/${slug}/`),
        en: absoluteSiteUrl(`/apps/en/${slug}/`),
      },
    },
    openGraph: { images: [] },
    twitter: { images: [] },
  };
}
