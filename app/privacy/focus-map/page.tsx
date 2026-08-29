import type { Metadata } from 'next';
import { InfoPage } from '@/components/info-page';
import { absoluteSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Focus Map プライバシーポリシー',
  description:
    'Focus Mapが収集しないデータと、端末内に保存する設定について説明します。',
  alternates: {
    canonical: absoluteSiteUrl('/privacy/focus-map/'),
    languages: {
      ja: absoluteSiteUrl('/privacy/focus-map/'),
      en: absoluteSiteUrl('/en/privacy/focus-map/'),
    },
  },
};

export default function Page() {
  return <InfoPage locale="ja" kind="privacy" />;
}
