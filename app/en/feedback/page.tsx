import type { Metadata } from 'next';
import { FeedbackPage } from '@/components/feedback-page';
import { absoluteSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'App Feedback',
  description:
    'Choose an app and share what you noticed in one free-text field.',
  alternates: {
    canonical: absoluteSiteUrl('/en/feedback/'),
    languages: {
      ja: absoluteSiteUrl('/feedback/'),
      en: absoluteSiteUrl('/en/feedback/'),
    },
  },
  openGraph: {
    title: 'App Feedback',
    description:
      'Choose the app and share anything you noticed in your own words.',
    url: absoluteSiteUrl('/en/feedback/'),
  },
  twitter: { card: 'summary' },
};

export default function Page() {
  return <FeedbackPage locale="en" scope="all" />;
}
