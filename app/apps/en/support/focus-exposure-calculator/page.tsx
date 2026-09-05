import { localizedAppRoute } from '@/lib/app-routes';
import type { Metadata } from 'next';
import { InfoPage } from '@/components/info-page';
import { absoluteSiteUrl, featuredApp, featuredAppPaths } from '@/lib/site';

export const dynamic = 'force-static';

const title = `${featuredApp.name.en} | Support`;
const description =
  'Information about results, calculation assumptions, and the feedback channel for bugs and requests.';
const url = absoluteSiteUrl(localizedAppRoute('en', featuredAppPaths.support));

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
    languages: {
      ja: absoluteSiteUrl(featuredAppPaths.support),
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
  return <InfoPage locale="en" kind="support" />;
}
