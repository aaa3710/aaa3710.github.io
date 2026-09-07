import { ArrowRight, MapPinned } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import { ReadableText } from '@/components/readable-text';
import { appCatalog } from '@/lib/app-catalog';
import { appPlaceholders, localePath, sitePath, type Locale } from '@/lib/site';
export function PortfolioHomePage({ locale }: { locale: Locale }) {
  const ja = locale === 'ja';
  return (
    <main id="top" lang={locale}>
      <SiteHeader locale={locale} languageHref={ja ? '/apps/en/' : '/apps/'} />
      <section className="catalog-heading section">
        <p className="section-label">
          {ja ? '個人制作のアプリ' : 'Independent apps'}
        </p>
        <h1>
          <ReadableText phrases>
            {ja
              ? '日々に役立つ、小さな道具。'
              : 'Small tools for everyday life.'}
          </ReadableText>
        </h1>
        <p>
          <ReadableText>
            {ja
              ? '気になるアプリから、機能や使い方をご覧ください。'
              : 'Find an app and explore what it can do.'}
          </ReadableText>
        </p>
      </section>
      <section
        className="app-catalog section"
        id="apps"
        aria-label={ja ? 'アプリ一覧' : 'Apps'}
      >
        <div className="portfolio-grid">
          {appCatalog.map((app) => (
            <a
              className="portfolio-card portfolio-card-ready"
              href={localePath(locale, app.paths.app)}
              key={app.slug}
            >
              <div className="portfolio-card-heading">
                {app.icon ? (
                  <img src={sitePath(app.icon)} alt="" width="64" height="64" />
                ) : (
                  <MapPinned aria-hidden="true" size={48} />
                )}
                <span className="status-pill">
                  {ja ? '公開準備中' : 'Preparing for release'}
                </span>
              </div>
              <div>
                <h2>
                  <ReadableText>{app.name[locale]}</ReadableText>
                </h2>
                <p>
                  <ReadableText>{app.summary[locale]}</ReadableText>
                </p>
              </div>
              <span className="card-link">
                {ja ? '詳しく見る' : 'Learn more'}
                <ArrowRight aria-hidden="true" size={16} />
              </span>
            </a>
          ))}
        </div>
        <section className="upcoming-apps" aria-labelledby="upcoming-title">
          <h2 id="upcoming-title">
            {ja ? '紹介を準備しているアプリ' : 'More introductions to come'}
          </h2>
          <ul>
            {appPlaceholders.map((app) => (
              <li key={app.slug}>{app.name}</li>
            ))}
          </ul>
        </section>
      </section>
      <SiteFooter locale={locale} />
    </main>
  );
}
