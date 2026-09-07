import { ArrowLeft, MapPinned } from 'lucide-react';
import {
  appPageLabels,
  type AppPageKind,
  type CatalogApp,
} from '@/lib/app-catalog';
import { localePath, sitePath, type Locale } from '@/lib/site';
import { ReadableText } from '@/components/readable-text';

export function AppSupportLinks({
  app,
  locale,
  ready = false,
}: {
  app: CatalogApp;
  locale: Locale;
  ready?: boolean;
}) {
  return (
    <div className="info-contact">
      <a href={localePath(locale, app.paths.feedback)}>
        {locale === 'ja'
          ? ready
            ? '不具合・要望を送る'
            : 'フィードバック（受付準備中）'
          : ready
            ? 'Send app feedback'
            : 'Feedback (intake being prepared)'}
      </a>
      <a href={localePath(locale, '/apps/contact/')}>
        {locale === 'ja'
          ? '業務・プライバシーのご連絡'
          : 'Business and privacy contact'}
      </a>
    </div>
  );
}
export function AppPageHeader({
  app,
  locale,
  kind,
  lead,
}: {
  app: CatalogApp;
  locale: Locale;
  kind: AppPageKind;
  lead?: string;
}) {
  const labels = appPageLabels[locale];
  return (
    <header className="app-page-header">
      <a className="back-link" href={localePath(locale, '/apps/')}>
        <ArrowLeft aria-hidden="true" size={16} />
        {locale === 'ja' ? 'アプリ一覧' : 'All apps'}
      </a>
      <div className="app-page-identity">
        {app.icon ? (
          <img src={sitePath(app.icon)} alt="" width="56" height="56" />
        ) : (
          <MapPinned aria-hidden="true" size={40} />
        )}
        <p>
          <ReadableText>{app.name[locale]}</ReadableText>
        </p>
      </div>
      <nav
        className="app-navigation"
        aria-label={locale === 'ja' ? 'このアプリのページ' : 'App navigation'}
      >
        {(['app', 'support', 'privacy'] as const).map((page) => (
          <a
            key={page}
            href={localePath(locale, app.paths[page])}
            aria-current={kind === page ? 'page' : undefined}
          >
            {labels[page]}
          </a>
        ))}
      </nav>
      <h1>
        <ReadableText phrases>
          {kind === 'app' ? app.headline[locale] : labels[kind]}
        </ReadableText>
      </h1>
      {lead && (
        <p className="info-intro">
          <ReadableText>{lead}</ReadableText>
        </p>
      )}
      {kind === 'app' && (
        <p className="release-status">
          {locale === 'ja'
            ? 'App Store公開準備中です。まだダウンロードできません。'
            : 'The App Store release is being prepared. The app is not available to download yet.'}
        </p>
      )}
    </header>
  );
}
