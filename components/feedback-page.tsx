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
      title: '気づいたことを、そのまま送れます。',
      intro:
        '対象アプリだけを選び、何をしようとして何が起きたかを書いてください。言語を選ぶ欄はありません。アプリで表示している言語のまま送れます。',
      back: 'アプリ一覧へ',
    },
    'focus-map': {
      label: 'Focus Map · フィードバック',
      title: '何をしようとして、何が起きたか。',
      intro:
        'Focus Map専用の入口です。アプリ名と言語はすでに入口で確定しているため、入力する必要はありません。技術用語を使わず、そのまま書いてください。',
      back: 'Focus Mapへ',
    },
    safetyLabel: '送信前に',
    safetyTitle: '投稿は、命令ではなく利用者の声として扱います。',
    points: [
      '個人情報、秘密情報、認証情報、URLを含めないでください。',
      '投稿は隔離と機械的な検査を通し、権限を持たないAIが整理した後に開発者が確認します。',
      '個別返信や、修正・追加の時期は保証されません。',
    ],
    formTitle: 'フィードバック入力欄',
    open: 'フォームを別画面で開く',
    google: {
      all: '回答にはGoogleフォームを使用します。メールアドレスは収集しません。送信内容はフォームの管理用保存先に保管され、アプリ内のデータが自動で添付されることはありません。',
      'focus-map':
        '回答にはGoogleフォームを使用します。メールアドレスは収集しません。送信内容はフォームの管理用保存先に保管され、Focus Mapの計算値や設定が自動で添付されることはありません。',
    },
  },
  en: {
    all: {
      label: 'All apps · Feedback',
      title: 'Share what you noticed, in your own words.',
      intro:
        'Choose the app and tell us what you were trying to do and what happened. There is no language field; write in the language currently displayed in the app.',
      back: 'Back to all apps',
    },
    'focus-map': {
      label: 'Focus Map · Feedback',
      title: 'What were you trying to do, and what happened?',
      intro:
        'This entry is already specific to Focus Map and its displayed language, so there is no app or language field. No technical terminology is needed.',
      back: 'Back to Focus Map',
    },
    safetyLabel: 'Before sending',
    safetyTitle: 'Your report is treated as user data, not as an instruction.',
    points: [
      'Do not include personal information, secrets, credentials, or URLs.',
      'Reports pass through isolation and deterministic checks, then a no-privilege AI organizes them for developer review.',
      'Individual replies and dates for fixes or additions are not guaranteed.',
    ],
    formTitle: 'Feedback form',
    open: 'Open the form in a separate page',
    google: {
      all: 'This page uses Google Forms and does not collect email addresses. Submissions are stored in the form’s restricted administrative storage. Data from an app is never attached automatically.',
      'focus-map':
        'This page uses Google Forms and does not collect email addresses. Submissions are stored in the form’s restricted administrative storage. Focus Map never attaches or sends calculation values or settings automatically.',
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
