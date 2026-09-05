import { ArrowUpRight, Globe2 } from 'lucide-react';
import { DocumentLanguage } from '@/components/document-language';
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
      <DocumentLanguage locale={locale} />
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
        <a href={localePath(locale, '/apps/#apps')}>
          {isEnglish ? 'Apps' : 'アプリ'}
        </a>
        <a href={localePath(locale, '/apps/contact/')}>
          {isEnglish ? 'Contact' : 'お問い合わせ'}
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
            ? 'Independent apps that began with something I wanted to use myself.'
            : '自分で使いたいと思ったところから、ひとつずつ作っています。'}
        </p>
      </div>
      <nav
        aria-label={isEnglish ? 'Footer navigation' : 'フッターナビゲーション'}
      >
        <a href={localePath(locale, '/apps/#apps')}>
          {isEnglish ? 'Apps' : 'アプリ'}
        </a>
        <a href={localePath(locale, '/apps/contact/')}>
          {isEnglish ? 'Contact' : 'お問い合わせ'}
        </a>
        <a href="#top">
          {isEnglish ? 'Back to top' : '先頭へ'}
          <ArrowUpRight aria-hidden="true" size={15} />
        </a>
      </nav>
    </footer>
  );
}
