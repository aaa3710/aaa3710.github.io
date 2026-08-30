import type { Metadata } from 'next';
import { FeedbackPage } from '@/components/feedback-page';
import { absoluteSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'アプリへのフィードバック',
  description:
    '対象アプリを選び、不具合、使いにくさ、機能の提案、計算結果への質問を送れます。',
  alternates: {
    canonical: absoluteSiteUrl('/feedback/'),
    languages: {
      ja: absoluteSiteUrl('/feedback/'),
      en: absoluteSiteUrl('/en/feedback/'),
    },
  },
};

export default function Page() {
  return <FeedbackPage locale="ja" scope="all" />;
}
