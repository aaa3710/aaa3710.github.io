import type { Metadata } from 'next';
import { FeedbackPage } from '@/components/feedback-page';
import { absoluteSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Focus Map フィードバック',
  description:
    'Focus Mapの不具合、使いにくさ、機能の提案、計算結果への質問を送れます。',
  alternates: {
    canonical: absoluteSiteUrl('/feedback/focus-map/'),
    languages: {
      ja: absoluteSiteUrl('/feedback/focus-map/'),
      en: absoluteSiteUrl('/en/feedback/focus-map/'),
    },
  },
};

export default function Page() {
  return <FeedbackPage locale="ja" scope="focus-map" />;
}
