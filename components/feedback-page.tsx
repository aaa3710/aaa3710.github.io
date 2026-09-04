import {
  ArrowLeft,
  ExternalLink,
  MessageSquareText,
  ShieldCheck,
} from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import {
  feedbackFormUrl,
  formReadiness,
  submissionNotice,
} from '@/lib/feedback';
import {
  featuredApp,
  featuredAppPaths,
  localePath,
  type Locale,
} from '@/lib/site';

const content = {
  ja: {
    label: 'ピントと光 — 撮影計算へのフィードバック',
    title: (
      <>
        <span className="feedback-title-line">気づいたことを、</span>
        <span className="feedback-title-line">一つの欄へ自由に。</span>
      </>
    ),
    intro:
      'この入口でアプリと表示言語は確定しています。アプリ名、言語、種類、端末、OSを選び直す必要はありません。',
    back: 'ピントと光 — 撮影計算へ',
    safetyLabel: '送信前に',
    safetyTitle: '匿名で送れます。通常、個別の返信は行いません。',
    points: [
      '大きな自由記述欄に、気づいたことをそのままお書きください。分かる範囲で、何をしていたか、何が起きたか、どうなるとよかったかがあると確認しやすくなります。',
      '個人情報、秘密情報、パスワード、認証コード、URLは入力しないでください。アプリの計算値や設定は自動で添付されません。',
      '内容はGoogleフォームを通じて送信・保存され、不具合・意見の確認と改善に必要な間だけ保持した後、不要になれば削除します。返信や修正時期はお約束できません。',
    ],
    formTitle: '自由記述で送る',
    open: 'フォームを別画面で開く',
    google:
      'Googleフォームを使用し、氏名やメールアドレスは収集しません。削除の依頼などプライバシーに関する連絡は、別のお問い合わせ窓口で扱います。匿名回答を確実に特定できない場合があります。AIによる整理を行う場合は、説明を更新し、必要な同意を得た範囲で行います。過去の回答を自動で流用しません。',
  },
  en: {
    label: 'Feedback for Focus & Light — Photo Tools',
    title: 'Share what you noticed in one free-text field.',
    intro:
      'This entry already identifies the app and display language. You do not need to re-enter the app name, language, category, device, or OS.',
    back: 'Back to Focus & Light — Photo Tools',
    safetyLabel: 'Before sending',
    safetyTitle:
      'Send anonymously. Individual replies are generally not provided.',
    points: [
      'Use the large free-text field for anything you noticed. If known, what you were doing, what happened, and what you hoped would happen can help with review.',
      'Do not include personal information, secrets, passwords, authentication codes, or URLs. The app never attaches calculations or settings automatically.',
      'Your text is sent and stored through Google Forms only while needed to review issues and feedback and improve the app, then deleted. A reply or delivery date cannot be promised.',
    ],
    formTitle: 'Write freely',
    open: 'Open the form in a separate page',
    google:
      'This Google Form does not collect names or email addresses. Privacy matters, including deletion requests, use the separate Contact route. A particular anonymous response may not be identifiable. Before any AI-assisted organization, the explanation will be updated and any required consent obtained. Previous responses will not be reused automatically.',
  },
} as const;

export function FeedbackPage({ locale }: { locale: Locale }) {
  const isEnglish = locale === 'en';
  const text = content[locale];
  const formUrl = feedbackFormUrl(locale);
  const embeddedUrl = feedbackFormUrl(locale, true);

  return (
    <main id="top" lang={locale}>
      <SiteHeader
        locale={locale}
        languageHref={
          isEnglish
            ? featuredAppPaths.feedback
            : `/en${featuredAppPaths.feedback}`
        }
      />

      <article className="feedback-page section">
        <a
          className="back-link"
          href={localePath(locale, featuredAppPaths.app)}
        >
          <ArrowLeft aria-hidden="true" size={16} />
          {text.back}
        </a>

        <div className="feedback-intro">
          <div>
            <p className="section-label">{text.label}</p>
            <h1>
              {formReadiness['app-feedback']
                ? text.title
                : isEnglish
                  ? 'App feedback'
                  : 'アプリのフィードバック'}
            </h1>
            <p>{text.intro}</p>
          </div>
          <MessageSquareText aria-hidden="true" />
        </div>

        {formReadiness['app-feedback'] ? (
          <>
            <section
              className="feedback-safety"
              aria-labelledby="feedback-safety"
            >
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
              <p>{submissionNotice[locale]}</p>
              <iframe
                loading="lazy"
                referrerPolicy="no-referrer"
                src={embeddedUrl}
                title={`${featuredApp.name[locale]} — ${text.formTitle}`}
              />
              <p>{text.google}</p>
              <p className="info-contact">
                <a href={localePath(locale, '/contact/')}>
                  {isEnglish
                    ? 'Privacy questions and deletion requests'
                    : 'プライバシー・削除の問い合わせ'}
                </a>
              </p>
            </section>
          </>
        ) : (
          <section className="form-pending" aria-labelledby="feedback-pending">
            <h2 id="feedback-pending">
              {isEnglish
                ? 'The feedback form is being prepared.'
                : 'フィードバックフォームを準備中です。'}
            </h2>
            <p>
              {isEnglish
                ? 'Submissions are not available from this page yet. The form will appear here once its content and settings have been checked.'
                : '現在、このページからは送信できません。フォームの内容と設定を確認した後、この場所に表示します。'}
            </p>
          </section>
        )}
      </article>

      <SiteFooter locale={locale} />
    </main>
  );
}
