import type { Metadata } from 'next';
import { InfoPage } from '@/components/info-page';
import { absoluteSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Focus Map サポートと計算の前提',
  description:
    'Focus Mapの計算結果の見方と、現在の計算に含まれないものを説明します。',
  alternates: {
    canonical: absoluteSiteUrl('/support/focus-map/'),
    languages: {
      ja: absoluteSiteUrl('/support/focus-map/'),
      en: absoluteSiteUrl('/en/support/focus-map/'),
    },
  },
  openGraph: {
    title: 'Focus Map — 計算結果の見方',
    description:
      '撮影前の目安として使うための前提と、計算に含まれないものを説明します。',
    url: absoluteSiteUrl('/support/focus-map/'),
  },
  twitter: { card: 'summary' },
};

export default function Page() {
  return <InfoPage locale="ja" kind="support" />;
}
