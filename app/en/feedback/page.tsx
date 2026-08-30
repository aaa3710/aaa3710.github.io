import type { Metadata } from 'next';
import { FeedbackPage } from '@/components/feedback-page';
import { absoluteSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'App Feedback',
  description: 'Choose an app and share what you noticed in one free-text field.',
  alternates: {
    canonical: absoluteSiteUrl('/en/feedback/'),
    languages: {
      ja: absoluteSiteUrl('/feedback/'),
      en: absoluteSiteUrl('/en/feedback/'),
    },
  },
};

export default function Page() {
  return <FeedbackPage locale="en" scope="all" />;
}
