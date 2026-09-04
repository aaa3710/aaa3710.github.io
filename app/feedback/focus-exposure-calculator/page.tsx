import type { Metadata } from 'next';
import { FeedbackPage } from '@/components/feedback-page';
import { formReadiness } from '@/lib/feedback';
import { featuredApp } from '@/lib/site';

export const dynamic = 'force-static';

const title = `${featuredApp.name.ja} | フィードバック`;
const description = formReadiness['app-feedback']
  ? `${featuredApp.name.ja}を使っていて気づいたことを、一つの自由記述欄から匿名で送れます。原則として個別返信はありません。`
  : `${featuredApp.name.ja}のフィードバック窓口は準備中です。現在は送信できません。`;

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  openGraph: { title, description },
  twitter: { card: 'summary', title, description },
};

export default function Page() {
  return <FeedbackPage locale="ja" />;
}
