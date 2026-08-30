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
      label: 'アプリへのフィードバック',
      title: (
        <>
          <span className="feedback-title-line">気づいたことを、</span>
          <span className="feedback-title-line">自由にお送りください。</span>
        </>
      ),
      intro:
        'どのアプリについてかを選び、気づいたことをそのまま書けます。意見の種類や言語を選ぶ必要はありません。',
      back: 'アプリ一覧へ',
    },
    'focus-map': {
      label: 'Focus Mapへのフィードバック',
      title: (
        <>
          <span className="feedback-title-line">
            Focus Mapで気づいたことを、
          </span>
          <span className="feedback-title-line">自由にお送りください。</span>
        </>
      ),
      intro: '気づいたことを、一つの入力欄にそのまま書いて送れます。',
      back: 'Focus Mapへ',
    },
    safetyLabel: '送信前に',
    safetyTitle: '送る前に、ここだけご確認ください。',
    points: [
      '分かる範囲で、何をしていたか、何が起きたか、どうなるとよかったかもお書きください。',
      '個人情報、パスワード、認証コード、URLは入力しないでください。',
      '内容は安全に確認し、必要に応じてAIで整理したうえで、開発者が読みます。返信や修正時期はお約束できません。',
    ],
    formTitle: '入力する',
    open: 'フォームを別画面で開く',
    google: {
      all: 'Googleフォームを使用し、メールアドレスは収集しません。入力した内容はGoogleのサービスを通じて送信・保存されます。アプリ内のデータが自動で添付されることはありません。',
      'focus-map':
        'Googleフォームを使用し、メールアドレスは収集しません。入力した内容はGoogleのサービスを通じて送信・保存されます。Focus Mapの計算値や設定が添付・送信されることはありません。',
    },
  },
  en: {
    all: {
      label: 'App feedback',
      title: 'Share anything you noticed while using an app.',
      intro:
        'Choose the app, then write freely in your own words. You do not need to select a category or language.',
      back: 'Back to all apps',
    },
    'focus-map': {
      label: 'Feedback for Focus Map',
      title: 'Share anything you noticed in Focus Map.',
      intro:
        'Write anything you noticed in the single text field, in your own words.',
      back: 'Back to Focus Map',
    },
    safetyLabel: 'Before sending',
    safetyTitle: 'A quick note before you send.',
    points: [
      'If you can, include what you were doing, what happened, and what you hoped would happen.',
      'Do not include personal information, passwords, authentication codes, or URLs.',
      'Your report is checked for safety, organized with AI when helpful, and then read by the developer. A reply or delivery date cannot be promised.',
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
          className={`feedback-form feedback-form-${scope}`}
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
