import type { Metadata } from 'next';
import { PortfolioHomePage } from '@/components/portfolio-home-page';
import { absoluteSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Apps — Independent apps for everyday problems',
  description:
    'Independent apps that began with small everyday problems and tools I wanted to use myself.',
  alternates: {
    canonical: absoluteSiteUrl('/en/'),
    languages: {
      ja: absoluteSiteUrl('/'),
      en: absoluteSiteUrl('/en/'),
    },
  },
  openGraph: {
    type: 'website',
    title: 'Apps — Independent apps for everyday problems',
    description:
      'Independent apps that began with small everyday problems and tools I wanted to use myself.',
    url: absoluteSiteUrl('/en/'),
  },
  twitter: {
    card: 'summary',
    title: 'Apps — Independent apps',
    description: 'Apps that began with tools I wanted to use myself.',
  },
};

export default function Page() {
  return <PortfolioHomePage locale="en" />;
}
