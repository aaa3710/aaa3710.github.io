import { localizedAppRoute } from '@/lib/app-routes';
import type { Metadata } from 'next';
import { FocusMapStory } from '@/components/focus-map-story';
import { absoluteSiteUrl, featuredApp, featuredAppPaths } from '@/lib/site';

export const dynamic = 'force-static';

const title = featuredApp.name.ja;
const description =
  'ピントを置く距離と絞りから、合って見える範囲を手早く確認するiPhoneアプリです。';
const url = absoluteSiteUrl(featuredAppPaths.app);
const image = absoluteSiteUrl(`${featuredApp.imageDirectory}/og-ja.png`);

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
    languages: {
      ja: url,
      en: absoluteSiteUrl(localizedAppRoute('en', featuredAppPaths.app)),
    },
  },
  openGraph: {
    title,
    description,
    url,
    images: [image],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [image],
  },
};

export default function Page() {
  return <FocusMapStory locale="ja" />;
}
