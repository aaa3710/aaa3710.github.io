import type { Metadata } from 'next';
import { InfoPage } from '@/components/info-page';
import { absoluteSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Focus Map サポートと計算の前提',
  description:
    'Focus Mapの問い合わせに必要な情報と、被写界深度・APEX・蛇腹計算の限界を説明します。',
  alternates: {
    canonical: absoluteSiteUrl('/support/focus-map/'),
    languages: {
      ja: absoluteSiteUrl('/support/focus-map/'),
      en: absoluteSiteUrl('/en/support/focus-map/'),
    },
  },
};

export default function Page() {
  return <InfoPage locale="ja" kind="support" />;
}
