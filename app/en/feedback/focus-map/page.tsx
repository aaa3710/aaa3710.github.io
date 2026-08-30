import type { Metadata } from 'next';
import { FeedbackPage } from '@/components/feedback-page';
import { absoluteSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Focus Map Feedback',
  description:
    'Report a Focus Map bug, usability problem, feature idea, or calculation question.',
  alternates: {
    canonical: absoluteSiteUrl('/en/feedback/focus-map/'),
    languages: {
      ja: absoluteSiteUrl('/feedback/focus-map/'),
      en: absoluteSiteUrl('/en/feedback/focus-map/'),
    },
  },
};

export default function Page() {
  return <FeedbackPage locale="en" scope="focus-map" />;
}
