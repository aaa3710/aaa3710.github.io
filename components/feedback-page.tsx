import {
  ArrowLeft,
  ExternalLink,
  MessageSquareText,
  ShieldCheck,
} from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import { feedbackFormUrl, type FeedbackScope } from '@/lib/feedback';
import { localePath, type Locale } from '@/lib/site';

const content = {
  ja: {
    all: {
      label: 'すべてのアプリ · フィードバック',
      title: '対象アプリを選び、気づいたことを書く。',
      intro:
        '対象アプリを一つ選んだら、気づいたことを一つの自由記述欄へそのまま書けます。意見の種類や言語を選ぶ必要はありません。',
      back: 'アプリ一覧へ',
    },
    'focus-map': {
      label: 'Focus Map · フィードバック',
      title: '気づいたことを、そのまま書く。',
      intro:
        'Focus Mapと表示言語はアプリ内の入口で確定しています。アプリ名、言語、意見の種類を選ぶ必要はなく、一つの自由記述欄だけで送れます。',
      back: 'Focus Mapへ',
    },
    safetyLabel: '送信前に',
    safetyTitle: '分かる範囲で、そのまま書いてください。',
    points: [
      'できれば、何をしていたか、何が起きたか、どうなるとよかったかも教えてください。',
      '個人情報、パスワード、認証コード、URLは書かないでください。',
      '内容は安全確認とAIによる整理の後、開発者が確認します。個別の返信や修正時期は保証されません。',
    ],
    formTitle: 'フィードバック入力欄',
    open: 'フォームを別画面で開く',
    google: {
      all: 'Googleフォームを使用し、メールアドレスは収集しません。入力した内容はGoogleのサービスを通じて送信・保存されます。アプリ内のデータが自動で添付されることはありません。',
      'focus-map':
        'Googleフォームを使用し、メールアドレスは収集しません。入力した内容はGoogleのサービスを通じて送信・保存されます。Focus Mapの計算値や設定が添付・送信されることはありません。',
    },
  },
  en: {
    all: {
      label: 'All apps · Feedback',
      title: 'Choose an app and share what you noticed.',
      intro:
        'Choose one app, then write freely in a single text field. There is no category or language field; use the language shown on this page.',
      back: 'Back to all apps',
    },
    'focus-map': {
      label: 'Focus Map · Feedback',
      title: 'Share what you noticed, in your own words.',
      intro:
        'Focus Map and the displayed language are set by the entry inside the app. There is no app, language, or category field—just one free-text field.',
      back: 'Back to Focus Map',
    },
    safetyLabel: 'Before sending',
    safetyTitle: 'Share what you know, in your own words.',
    points: [
      'If you can, include what you were doing, what happened, and what you hoped would happen.',
      'Do not include personal information, passwords, authentication codes, or URLs.',
      'Your report is safety-checked, organized with AI, and then reviewed by the developer. A reply or a delivery date for a change is not guaranteed.',
    ],
    formTitle: 'Feedback form',
    open: 'Open the form in a separate page',
    google: {
      all: 'This page uses Google Forms and does not collect email addresses. What you enter is sent and stored through Google’s service. No app data is attached automatically.',
      'focus-map':
        'This page uses Google Forms and does not collect email addresses. What you enter is sent and stored through Google’s service. Focus Map never attaches or sends calculation values or settings.',
    },
  },
} as const;

export function FeedbackPage({
  locale,
  scope,
}: {
  locale: Locale;
  scope: FeedbackScope;
}) {
  const isEnglish = locale === 'en';
  const text = content[locale];
  const page = text[scope];
  const formUrl = feedbackFormUrl(scope, locale);
  const embeddedUrl = feedbackFormUrl(scope, locale, true);
  const appPath = scope === 'focus-map' ? '/apps/focus-map/' : '/';

  return (
    <main id="top" lang={locale}>
      <SiteHeader
        locale={locale}
        languageHref={
          isEnglish
            ? scope === 'focus-map'
              ? '/feedback/focus-map/'
              : '/feedback/'
            : scope === 'focus-map'
              ? '/en/feedback/focus-map/'
              : '/en/feedback/'
        }
      />

      <article className="feedback-page section">
        <a className="back-link" href={localePath(locale, appPath)}>
          <ArrowLeft aria-hidden="true" size={16} />
          {page.back}
        </a>

        <div className="feedback-intro">
          <div>
            <p className="section-label">{page.label}</p>
            <h1>{page.title}</h1>
            <p>{page.intro}</p>
          </div>
          <MessageSquareText aria-hidden="true" />
        </div>

        <section className="feedback-safety" aria-labelledby="feedback-safety">
          <ShieldCheck aria-hidden="true" />
          <div>
            <p className="section-label">{text.safetyLabel}</p>
            <h2 id="feedback-safety">{text.safetyTitle}</h2>
            <ul>
              {text.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="feedback-form"
          aria-labelledby="feedback-form-title"
        >
          <div className="feedback-form-heading">
            <h2 id="feedback-form-title">{text.formTitle}</h2>
            <a href={formUrl} rel="noreferrer" target="_blank">
              {text.open}
              <ExternalLink aria-hidden="true" size={15} />
            </a>
          </div>
          <iframe
            loading="lazy"
            referrerPolicy="no-referrer"
            src={embeddedUrl}
            title={text.formTitle}
          />
          <p>{text.google[scope]}</p>
        </section>
      </article>

      <SiteFooter locale={locale} />
    </main>
  );
}
