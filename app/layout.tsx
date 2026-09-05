import type { Metadata } from 'next';
import './globals.css';
import { absoluteSiteUrl, canonicalBaseUrl } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  metadataBase: new URL(`${canonicalBaseUrl}/`),
  applicationName: 'Apps',
  title: 'Apps — 個人制作アプリ',
  description:
    '日々の小さな困りごとから作り始めた、個人制作アプリの紹介サイトです。',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    siteName: 'Apps',
    title: 'Apps — 個人制作アプリ',
    description:
      '日々の小さな困りごとから作り始めた、個人制作アプリの紹介サイトです。',
    url: absoluteSiteUrl('/apps/'),
  },
  twitter: {
    card: 'summary',
    title: 'Apps — 個人制作アプリ',
    description: '日々の小さな困りごとから作り始めたアプリを紹介します。',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
