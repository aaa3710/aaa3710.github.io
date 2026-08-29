import type { Metadata } from 'next';
import { FocusMapDetail } from '@/components/focus-map-detail';
import { absoluteSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Focus Map — Depth of Field & APEX',
  description:
    'A planned free iPhone app for checking depth of field, continuous blur, physical sensor sizes, and APEX exposure while shooting.',
  alternates: {
    canonical: absoluteSiteUrl('/en/apps/focus-map/'),
    languages: {
      ja: absoluteSiteUrl('/apps/focus-map/'),
      en: absoluteSiteUrl('/en/apps/focus-map/'),
    },
  },
  openGraph: {
    title: 'Focus Map — See the range of acceptable focus',
    description:
      'An iPhone app for checking depth of field, continuous blur, sensor sizes, and APEX exposure.',
    url: absoluteSiteUrl('/en/apps/focus-map/'),
    images: [absoluteSiteUrl('/images/focus-map/og.png')],
  },
  twitter: {
    card: 'summary_large_image',
    images: [absoluteSiteUrl('/images/focus-map/og.png')],
  },
};

export default function Page() {
  return <FocusMapDetail locale="en" />;
}
