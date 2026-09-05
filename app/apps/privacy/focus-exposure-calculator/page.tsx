import { localizedAppRoute } from '@/lib/app-routes';
import type { Metadata } from 'next';
import { InfoPage } from '@/components/info-page';
import { absoluteSiteUrl, featuredApp, featuredAppPaths } from '@/lib/site';

export const dynamic = 'force-static';

const title = `${featuredApp.name.ja} | プライバシーポリシー`;
const description = `${featuredApp.name.ja}が収集しないデータと、端末内に保存する設定について説明します。`;
const url = absoluteSiteUrl(featuredAppPaths.privacy);

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
    languages: {
      ja: url,
      en: absoluteSiteUrl(localizedAppRoute('en', featuredAppPaths.privacy)),
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
  return <InfoPage locale="ja" kind="privacy" />;
}
