import type { Metadata } from 'next';
import { ContactPage } from '@/components/contact-page';
import { formReadiness } from '@/lib/feedback';
import { absoluteSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

const title = 'お問い合わせ';
const description = formReadiness.contact
  ? '業務・運営・プライバシー請求・その他のご連絡を受け付けます。アプリの不具合や要望は、各アプリのサポートをご確認ください。'
  : '業務・運営・プライバシー請求・その他のお問い合わせ窓口は準備中です。現在は送信できません。';
const url = absoluteSiteUrl('/contact/');

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
    languages: {
      ja: url,
      en: absoluteSiteUrl('/en/contact/'),
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
  return <ContactPage locale="ja" />;
}
