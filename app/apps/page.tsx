import type { Metadata } from 'next';
import { PortfolioHomePage } from '@/components/portfolio-home-page';
import { absoluteSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Apps — 毎日の小さな困りごとから生まれたアプリ',
  description:
    '自分で使いたいと思ったところから作り始めた、個人制作アプリの紹介サイトです。',
  alternates: {
    canonical: absoluteSiteUrl('/apps/'),
    languages: {
      ja: absoluteSiteUrl('/apps/'),
      en: absoluteSiteUrl('/apps/en/'),
    },
  },
  openGraph: {
    type: 'website',
    title: 'Apps — 毎日の小さな困りごとから生まれたアプリ',
    description:
      '自分で使いたいと思ったところから作り始めた、個人制作アプリの紹介サイトです。',
    url: absoluteSiteUrl('/apps/'),
  },
  twitter: {
    card: 'summary',
    title: 'Apps — 個人制作アプリ',
    description:
      '自分で使いたいと思ったところから作り始めたアプリを紹介します。',
  },
};

export default function Page() {
  return <PortfolioHomePage locale="ja" />;
}
