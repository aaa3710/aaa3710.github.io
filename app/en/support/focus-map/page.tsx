import type { Metadata } from 'next';
import { InfoPage } from '@/components/info-page';
import { absoluteSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Focus Map Support and Calculation Assumptions',
  description:
    'Information to include in a support request and the limits of Focus Map’s depth-of-field, APEX, and bellows calculations.',
  alternates: {
    canonical: absoluteSiteUrl('/en/support/focus-map/'),
    languages: {
      ja: absoluteSiteUrl('/support/focus-map/'),
      en: absoluteSiteUrl('/en/support/focus-map/'),
    },
  },
};

export default function Page() {
  return <InfoPage locale="en" kind="support" />;
}
