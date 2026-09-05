import { localizedAppRoute } from '@/lib/app-routes';
import type { Metadata } from 'next';
import { InfoPage } from '@/components/info-page';
import { absoluteSiteUrl, featuredApp, featuredAppPaths } from '@/lib/site';

export const dynamic = 'force-static';

const title = `${featuredApp.name.ja} | サポート`;
const description =
  '計算結果の見方、計算の前提と、不具合・要望の窓口について案内します。';
const url = absoluteSiteUrl(featuredAppPaths.support);

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
    languages: {
      ja: url,
      en: absoluteSiteUrl(localizedAppRoute('en', featuredAppPaths.support)),
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
  return <InfoPage locale="ja" kind="support" />;
}
