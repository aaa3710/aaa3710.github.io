import type { Metadata } from 'next';
import { FeedbackPage } from '@/components/feedback-page';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Focus Map Feedback',
  description: 'Share what you noticed in Focus Map using one free-text field.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <FeedbackPage locale="en" scope="focus-map" />;
}
