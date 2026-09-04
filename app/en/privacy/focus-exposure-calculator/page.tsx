import type { Metadata } from 'next';
import { InfoPage } from '@/components/info-page';
import { absoluteSiteUrl, featuredApp, featuredAppPaths } from '@/lib/site';

export const dynamic = 'force-static';

const title = `${featuredApp.name.en} | Privacy Policy`;
const description = `What ${featuredApp.name.en} does not collect and which settings remain locally on the iPhone.`;
const url = absoluteSiteUrl(`/en${featuredAppPaths.privacy}`);

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
    languages: {
      ja: absoluteSiteUrl(featuredAppPaths.privacy),
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
  return <InfoPage locale="en" kind="privacy" />;
}
