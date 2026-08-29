import type { Metadata } from 'next';
import './globals.css';
import { absoluteSiteUrl, canonicalBaseUrl } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  metadataBase: new URL(`${canonicalBaseUrl}/`),
  applicationName: 'Apps',
  title: 'Apps — Focus Map',
  description:
    'Focus Mapをはじめ、迷わず使い終えられることを大切にした個人制作アプリの公式サイトです。',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    siteName: 'Apps',
    title: 'Focus Map — ピントの範囲を、見える形に。',
    description:
      '被写界深度と連続的なボケ量を、撮影中に読み取りやすい形で確かめるiPhoneアプリ。',
    url: absoluteSiteUrl('/'),
    images: [
      {
        url: absoluteSiteUrl('/og.png'),
        width: 1200,
        height: 630,
        alt: 'Focus Map — ピントの範囲を、見える形に。',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Focus Map — ピントの範囲を、見える形に。',
    description: '被写界深度と連続的なボケ量を確かめるiPhoneアプリ。',
    images: [absoluteSiteUrl('/og.png')],
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
