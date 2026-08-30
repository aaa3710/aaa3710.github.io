import type { Metadata } from 'next';
import { FocusMapStory } from '@/components/focus-map-story';
import { absoluteSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Focus Map — 撮影前にピントの範囲を確認',
  description:
    'ピントを置く距離と絞りから、合って見える範囲を手早く確認するiPhoneアプリです。',
  alternates: {
    canonical: absoluteSiteUrl('/apps/focus-map/'),
    languages: {
      ja: absoluteSiteUrl('/apps/focus-map/'),
      en: absoluteSiteUrl('/en/apps/focus-map/'),
    },
  },
  openGraph: {
    title: 'Focus Map — ピント合わせの計算を短く',
    description:
      'マニュアルフォーカスの撮影前に、ピントが合って見える範囲を確認するiPhoneアプリ。',
    url: absoluteSiteUrl('/apps/focus-map/'),
    images: [absoluteSiteUrl('/images/focus-map/og.png')],
  },
  twitter: {
    card: 'summary_large_image',
    images: [absoluteSiteUrl('/images/focus-map/og.png')],
  },
};

export default function Page() {
  return <FocusMapStory locale="ja" />;
}
