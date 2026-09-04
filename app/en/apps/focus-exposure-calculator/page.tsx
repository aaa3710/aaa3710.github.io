import type { Metadata } from 'next';
import { FocusMapStory } from '@/components/focus-map-story';
import { absoluteSiteUrl, featuredApp, featuredAppPaths } from '@/lib/site';

export const dynamic = 'force-static';

const title = featuredApp.name.en;
const description =
  'An iPhone app for quickly checking how far acceptable focus extends from a chosen distance and aperture.';
const url = absoluteSiteUrl(`/en${featuredAppPaths.app}`);
const image = absoluteSiteUrl(`${featuredApp.imageDirectory}/og-en.png`);

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
    languages: {
      ja: absoluteSiteUrl(featuredAppPaths.app),
      en: url,
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
  return <FocusMapStory locale="en" />;
}
