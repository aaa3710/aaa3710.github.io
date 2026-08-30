import type { Metadata } from 'next';
import { FeedbackPage } from '@/components/feedback-page';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Focus Map フィードバック',
  description:
    'Focus Mapを使っていて気づいたことを、一つの自由記述欄から送れます。',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <FeedbackPage locale="ja" scope="focus-map" />;
}
