import type { Metadata } from 'next';
import { FocusMapDetail } from '@/components/focus-map-detail';
import { absoluteSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Focus Map — ピントと露出を見える化',
  description:
    '被写界深度、連続的なボケ量、センサー実寸、APEX露出を撮影中に確かめる、無料公開予定のiPhoneアプリです。',
  alternates: {
    canonical: absoluteSiteUrl('/apps/focus-map/'),
    languages: {
      ja: absoluteSiteUrl('/apps/focus-map/'),
      en: absoluteSiteUrl('/en/apps/focus-map/'),
    },
  },
  openGraph: {
    title: 'Focus Map — ピントの範囲を、見える形に。',
    description:
      '被写界深度、連続的なボケ量、センサー実寸、APEX露出を確かめるiPhoneアプリ。',
    url: absoluteSiteUrl('/apps/focus-map/'),
    images: [absoluteSiteUrl('/images/focus-map/og.png')],
  },
  twitter: {
    card: 'summary_large_image',
    images: [absoluteSiteUrl('/images/focus-map/og.png')],
  },
};

export default function Page() {
  return <FocusMapDetail locale="ja" />;
}
