import { ArrowLeft, Clock3 } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import { appPlaceholders, localePath, type Locale } from '@/lib/site';

export function PlaceholderPage({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const app = appPlaceholders.find((candidate) => candidate.slug === slug);
  const isEnglish = locale === 'en';

  if (!app) {
    return null;
  }

  return (
    <main id="top" lang={locale}>
      <SiteHeader
        locale={locale}
        languageHref={isEnglish ? `/apps/${slug}/` : `/apps/en/${slug}/`}
      />
      <section className="placeholder-page section">
        <a className="back-link" href={localePath(locale)}>
          <ArrowLeft aria-hidden="true" size={16} />
          {isEnglish ? 'All apps' : 'アプリ一覧'}
        </a>
        <div className="placeholder-icon" aria-hidden="true">
          <Clock3 />
        </div>
        <p className="section-label">{isEnglish ? 'In progress' : '準備中'}</p>
        <h1>{app.name}</h1>
        <p>
          {isEnglish
            ? 'This introduction will be published once the current features and screens can be described accurately.'
            : '現在の機能と画面を正確にご案内できるようになってから、紹介を公開します。'}
        </p>
      </section>
      <SiteFooter locale={locale} />
    </main>
  );
}
