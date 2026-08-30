import type { Metadata } from 'next';
import { FocusMapStory } from '@/components/focus-map-story';
import { absoluteSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Focus Map — Check the focus range before the shot',
  description:
    'An iPhone app for quickly checking how far acceptable focus extends from a chosen distance and aperture.',
  alternates: {
    canonical: absoluteSiteUrl('/en/apps/focus-map/'),
    languages: {
      ja: absoluteSiteUrl('/apps/focus-map/'),
      en: absoluteSiteUrl('/en/apps/focus-map/'),
    },
  },
  openGraph: {
    title: 'Focus Map — Spend less time calculating focus',
    description:
      'Check the acceptable focus range before shooting with a manual-focus camera or lens.',
    url: absoluteSiteUrl('/en/apps/focus-map/'),
    images: [absoluteSiteUrl('/images/focus-map/og.png')],
  },
  twitter: {
    card: 'summary_large_image',
    images: [absoluteSiteUrl('/images/focus-map/og.png')],
  },
};

export default function Page() {
  return <FocusMapStory locale="en" />;
}
