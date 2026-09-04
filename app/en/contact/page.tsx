import type { Metadata } from 'next';
import { ContactPage } from '@/components/contact-page';
import { formReadiness } from '@/lib/feedback';
import { absoluteSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

const title = 'Contact';
const description = formReadiness.contact
  ? 'For business, administration, privacy requests, and other inquiries. For app bugs and requests, visit the support page for that app.'
  : 'The contact channel for business, administration, privacy requests, and other inquiries is being prepared. Messages cannot be sent yet.';
const url = absoluteSiteUrl('/en/contact/');

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
    languages: {
      ja: absoluteSiteUrl('/contact/'),
      en: url,
    },
  },
  openGraph: {
    title,
    description,
    url,
  },
  twitter: { card: 'summary', title, description },
};

export default function Page() {
  return <ContactPage locale="en" />;
}
