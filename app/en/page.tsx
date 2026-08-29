import type { Metadata } from 'next';
import { HomePage } from '@/components/home-page';
import { absoluteSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Apps — Focus Map and small tools for fewer decisions',
  description:
    'The official home of Focus Map and independently made apps designed to keep everyday tasks calm and direct.',
  alternates: {
    canonical: absoluteSiteUrl('/en/'),
    languages: {
      ja: absoluteSiteUrl('/'),
      en: absoluteSiteUrl('/en/'),
    },
  },
};

export default function Page() {
  return <HomePage locale="en" />;
}
