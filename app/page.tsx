import type { Metadata } from 'next';
import { HomePage } from '@/components/home-page';
import { absoluteSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Apps — Focus Mapと、日々の判断を短くするアプリ',
  description:
    'Focus Mapをはじめ、迷わず使い終えられることを大切にした個人制作アプリの公式サイトです。',
  alternates: {
    canonical: absoluteSiteUrl('/'),
    languages: {
      ja: absoluteSiteUrl('/'),
      en: absoluteSiteUrl('/en/'),
    },
  },
};

export default function Page() {
  return <HomePage locale="ja" />;
}
