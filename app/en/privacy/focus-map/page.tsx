import type { Metadata } from 'next';
import { InfoPage } from '@/components/info-page';
import { absoluteSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Focus Map Privacy Policy',
  description:
    'What Focus Map does not collect and which settings remain locally on the iPhone.',
  alternates: {
    canonical: absoluteSiteUrl('/en/privacy/focus-map/'),
    languages: {
      ja: absoluteSiteUrl('/privacy/focus-map/'),
      en: absoluteSiteUrl('/en/privacy/focus-map/'),
    },
  },
};

export default function Page() {
  return <InfoPage locale="en" kind="privacy" />;
}
