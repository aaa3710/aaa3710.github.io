import { ArrowUpRight, Globe2 } from 'lucide-react';
import type { Locale } from '@/lib/site';
import { localePath, sitePath } from '@/lib/site';

type HeaderProps = {
  locale: Locale;
  languageHref: string;
};

export function SiteHeader({ locale, languageHref }: HeaderProps) {
  const isEnglish = locale === 'en';

  return (
    <header className="site-header">
      <a
        className="site-mark"
        href={localePath(locale)}
        aria-label={isEnglish ? 'Apps home' : 'アプリ一覧の先頭へ'}
      >
        <span className="site-mark-dot" aria-hidden="true" />
        <span>Apps</span>
      </a>
      <nav
        className="site-nav"
        aria-label={isEnglish ? 'Main navigation' : '主なページ'}
      >
        <a href={localePath(locale, '/apps/focus-map/')}>Focus Map</a>
        <a href={localePath(locale, '/feedback/')}>
          {isEnglish ? 'Feedback' : 'フィードバック'}
        </a>
        <a href={`${localePath(locale)}#principles`}>
          {isEnglish ? 'Principles' : 'つくり方'}
        </a>
        <a
          className="language-button"
          href={sitePath(languageHref)}
          aria-label="Language / 言語"
        >
          <Globe2 aria-hidden="true" size={18} strokeWidth={1.8} />
          <span>{isEnglish ? '日本語' : 'English'}</span>
        </a>
      </nav>
    </header>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const isEnglish = locale === 'en';

  return (
    <footer className="site-footer">
      <div>
        <a className="site-mark" href={localePath(locale)}>
          <span className="site-mark-dot" aria-hidden="true" />
          <span>Apps</span>
        </a>
        <p>
          {isEnglish
            ? 'Small tools made to remove a little friction from everyday decisions.'
            : '日々の判断を少しだけ短くする、小さな道具をつくっています。'}
        </p>
      </div>
      <nav
        aria-label={isEnglish ? 'Footer navigation' : 'フッターナビゲーション'}
      >
        <a href={localePath(locale, '/apps/focus-map/')}>Focus Map</a>
        <a href={localePath(locale, '/privacy/focus-map/')}>
          {isEnglish ? 'Privacy' : 'プライバシー'}
        </a>
        <a href={localePath(locale, '/support/focus-map/')}>
          {isEnglish ? 'Support' : 'サポート'}
        </a>
        <a href={localePath(locale, '/feedback/')}>
          {isEnglish ? 'Feedback' : 'フィードバック'}
        </a>
        <a href="#top">
          {isEnglish ? 'Back to top' : '先頭へ'}
          <ArrowUpRight aria-hidden="true" size={15} />
        </a>
      </nav>
    </footer>
  );
}
