import type { Metadata } from 'next';
import { InfoPage } from '@/components/info-page';
import { absoluteSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Focus Map Support and Calculation Assumptions',
  description:
    'How to read Focus Map results and what is outside the current calculations.',
  alternates: {
    canonical: absoluteSiteUrl('/en/support/focus-map/'),
    languages: {
      ja: absoluteSiteUrl('/support/focus-map/'),
      en: absoluteSiteUrl('/en/support/focus-map/'),
    },
  },
  openGraph: {
    title: 'Focus Map — Understanding the results',
    description:
      'The assumptions behind the calculations and what they do not cover.',
    url: absoluteSiteUrl('/en/support/focus-map/'),
  },
  twitter: { card: 'summary' },
};

export default function Page() {
  return <InfoPage locale="en" kind="support" />;
}
