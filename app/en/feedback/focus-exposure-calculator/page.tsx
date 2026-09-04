import type { Metadata } from 'next';
import { FeedbackPage } from '@/components/feedback-page';
import { formReadiness } from '@/lib/feedback';
import { featuredApp } from '@/lib/site';

export const dynamic = 'force-static';

const title = `${featuredApp.name.en} | Feedback`;
const description = formReadiness['app-feedback']
  ? `Share what you noticed in ${featuredApp.name.en} anonymously using one free-text field. Individual replies are not normally provided.`
  : `The feedback channel for ${featuredApp.name.en} is being prepared. Feedback cannot be sent yet.`;

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  openGraph: { title, description },
  twitter: { card: 'summary', title, description },
};

export default function Page() {
  return <FeedbackPage locale="en" />;
}
