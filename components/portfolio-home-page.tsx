import {
  ArrowRight,
  CircleHelp,
  Layers3,
  MessageSquareText,
  MousePointerClick,
} from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import {
  appPlaceholders,
  featuredApp,
  featuredAppPaths,
  localePath,
  sitePath,
  type Locale,
} from '@/lib/site';

const copy = {
  ja: {
    eyebrow: '個人制作のアプリ',
    title: (
      <>
        <span className="title-line">毎日の小さな</span>
        <span className="title-line">困りごとを、</span>
        <span className="title-line">使いやすいアプリに。</span>
      </>
    ),
    lead: '日々の中で「こんな道具があれば」と思ったことから、個人で作っているアプリを紹介しています。公開準備が整ったものから、詳しい使い方と入手先を掲載します。',
    appsAction: 'アプリを見る',
    feedbackAction: 'お問い合わせ',
    appsEyebrow: 'アプリ',
    appsTitle: '現在のアプリ',
    appsBody:
      '「ピントと光 — 撮影計算」の詳しい紹介を公開しています。ほかのアプリも、内容と画面を正確に案内できる状態になったものから追加します。',
    focusState: 'App Store公開準備中',
    focusSummary:
      'ピントを置く距離と絞りから、合って見える範囲を確かめるiPhoneアプリ。',
    ready: '詳しく見る',
    preparing: '紹介ページを準備中',
    valuesEyebrow: '使いやすさについて',
    valuesTitle: 'やりたいことへ、迷わず進めるように。',
    values: [
      [
        'まず必要なものだけ',
        '最初の画面では、その場で使う結果と操作を優先します。',
      ],
      [
        '詳しく知りたいときは奥へ',
        '設定や仕組みは省かず、必要になったときに開ける順序にします。',
      ],
      [
        '分からないことを隠さない',
        '計算の前提や未確認のことは、確かめられる場所に明記します。',
      ],
    ],
    feedbackTitle: '業務・運営・その他のご連絡はこちら。',
    feedbackBody:
      'アプリの不具合や要望は、各アプリのサポートから専用フィードバックへお進みください。',
    feedbackButton: 'お問い合わせへ',
  },
  en: {
    eyebrow: 'Independent apps',
    title: 'Small everyday problems, turned into useful apps.',
    lead: 'These apps began with moments when I wished a better tool existed. Full guides and download links are added as each app is ready to present accurately.',
    appsAction: 'Browse the apps',
    feedbackAction: 'Contact',
    appsEyebrow: 'Apps',
    appsTitle: 'Current apps',
    appsBody:
      'A full introduction to Focus & Light — Photo Tools is available now. Other app pages will be added once their current features and screens are ready to describe accurately.',
    focusState: 'Preparing for the App Store',
    focusSummary:
      'An iPhone app that shows how far acceptable focus extends from a chosen distance and aperture.',
    ready: 'Learn more',
    preparing: 'Introduction in progress',
    valuesEyebrow: 'Designed for ease',
    valuesTitle: 'A clear path to what you came to do.',
    values: [
      [
        'Start with what matters now',
        'The first screen prioritizes the result and controls needed for the task at hand.',
      ],
      [
        'Go deeper when you choose',
        'Settings and explanations remain available without interrupting the main path.',
      ],
      [
        'Keep uncertainty visible',
        'Assumptions and unverified details are stated where you can find them.',
      ],
    ],
    feedbackTitle: 'For business, site administration, or other inquiries.',
    feedbackBody:
      'For app bugs or feature requests, use the app-specific feedback link on its support page.',
    feedbackButton: 'Open contact page',
  },
} as const;

export function PortfolioHomePage({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const isEnglish = locale === 'en';

  return (
    <main id="top" lang={locale}>
      <SiteHeader locale={locale} languageHref={isEnglish ? '/' : '/en/'} />

      <section className="portfolio-hero section" aria-labelledby="page-title">
        <p className="section-label">{text.eyebrow}</p>
        <h1 id="page-title">{text.title}</h1>
        <p>{text.lead}</p>
        <div className="portfolio-actions">
          <a className="primary-action" href={localePath(locale, '/#apps')}>
            {text.appsAction}
            <ArrowRight aria-hidden="true" size={17} />
          </a>
          <a
            className="secondary-action"
            href={localePath(locale, '/contact/')}
          >
            {text.feedbackAction}
          </a>
        </div>
      </section>

      <section
        className="app-catalog section"
        id="apps"
        aria-labelledby="apps-title"
      >
        <div className="section-intro">
          <div>
            <p className="section-label">{text.appsEyebrow}</p>
            <h2 id="apps-title">{text.appsTitle}</h2>
          </div>
          <p>{text.appsBody}</p>
        </div>

        <div className="portfolio-grid">
          <a
            className="portfolio-card portfolio-card-ready"
            href={localePath(locale, featuredAppPaths.app)}
          >
            <div className="portfolio-card-heading">
              <img
                src={sitePath(`${featuredApp.imageDirectory}/icon.png`)}
                alt=""
                width="64"
                height="64"
              />
              <span className="status-pill">{text.focusState}</span>
            </div>
            <div>
              <h3>{featuredApp.name[locale]}</h3>
              <p>{text.focusSummary}</p>
            </div>
            <span className="card-link">
              {text.ready}
              <ArrowRight aria-hidden="true" size={16} />
            </span>
          </a>

          {appPlaceholders.map((app) => (
            <article className="portfolio-card" key={app.slug}>
              <span className="status-pill">{text.preparing}</span>
              <h3>{app.name}</h3>
            </article>
          ))}
        </div>
      </section>

      <section
        className="values-section section"
        aria-labelledby="values-title"
      >
        <p className="section-label">{text.valuesEyebrow}</p>
        <h2 id="values-title">{text.valuesTitle}</h2>
        <div className="value-grid">
          {text.values.map(([title, body], index) => (
            <article key={title}>
              {index === 0 ? (
                <MousePointerClick aria-hidden="true" />
              ) : index === 1 ? (
                <Layers3 aria-hidden="true" />
              ) : (
                <CircleHelp aria-hidden="true" />
              )}
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="feedback-section section">
        <a className="feedback-banner" href={localePath(locale, '/contact/')}>
          <MessageSquareText aria-hidden="true" />
          <span>
            <strong>{text.feedbackTitle}</strong>
            <small>{text.feedbackBody}</small>
          </span>
          <span className="feedback-banner-action">
            {text.feedbackButton}
            <ArrowRight aria-hidden="true" size={16} />
          </span>
        </a>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
