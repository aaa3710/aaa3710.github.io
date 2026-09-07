import { localizedAppRoute } from '@/lib/app-routes';
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
    label: '撮影のものさしへのフィードバック',
    title: (
      <>
        <span className="feedback-title-line">気づいたことを、</span>
        <span className="feedback-title-line">一つの欄へ自由に。</span>
      </>
    ),
    intro:
      'この入口でアプリと表示言語は確定しています。アプリ名、言語、種類、端末、OSを選び直す必要はありません。',
    back: '撮影のものさしへ',
    safetyLabel: '送信前に',
    safetyTitle: '氏名・メールは不要です。個別の返信は原則ありません。',
    points: [
      '大きな自由記述欄に、気づいたことをそのままお書きください。分かる範囲で、何をしていたか、何が起きたか、どうなるとよかったかがあると確認しやすくなります。',
      '個人情報、秘密情報、パスワード、認証コード、URL、第三者の情報は入力しないでください。アプリの計算値や設定は自動で添付されません。',
      '内容は不具合・ご意見の把握、安全確認、アプリ改善のためにGoogle Formsで受け取ります。有用な報告は概ね1か月以内の改善につなげることを目指しますが、全件の内容把握・対応、期限、個別返信は保証しません。',
    ],
    processing:
      '回答本文をそのまま外部AIへ渡しません。個人情報や本文を含まない、安全に作成できる改善候補を必要時にAIで整理する方針です。実回答のAI整理はまだ開始していません。新たな外部AIへ本文を渡す場合は、開始前に案内し必要な同意を得ます。以前の回答を当然には流用しません。',
    testFlight:
      'TestFlight参加者はTestFlightのフィードバック機能をご利用ください。プライバシーの請求は、TestFlightのこのアプリの情報欄にある「Appの詳細」で開発者メールを確認してお送りください。',
    consent:
      '送信は任意です。プライバシーポリシーで利用目的、国外での取扱い、保持・削除をご確認ください。米国のGoogle LLCへの送信・保存と、説明した国外での取扱いに同意する場合に「送信」を押してください。',
    formTitle: '自由記述で送る',
    open: 'フォームを別画面で開く',
    google:
      '氏名やメールの回答欄はなく、メールを自動収集しません。自分で識別情報を書いた場合まで匿名性を保証するものではありません。Google Formsの提供者は米国のGoogle LLCです。情報は米国を含む世界各地で処理される場合があり、個々の回答の保存・処理国を開発者が指定・特定することはできません。米国のGlobal CBPR Forum参加は、日本と同じ制度やGoogleの個別認証を保証しません。Googleは暗号化・アクセス制限等を説明し、サービス提供・改善・安全確保や法的要請等でも情報を扱います。回答は目的に必要な間だけ保持し、不要になれば削除します。周期だけを理由に一律削除しません。削除などのご依頼はContactへ、送信日時と秘密でない本文の一部をお知らせください。特定できない場合がありますが、法令上の権利を制限しません。',
  },
  en: {
    label: 'Feedback for Photo Yardstick',
    title: 'Share what you noticed in one free-text field.',
    intro:
      'This entry already identifies the app and display language. You do not need to re-enter the app name, language, category, device, or OS.',
    back: 'Back to Photo Yardstick',
    safetyLabel: 'Before sending',
    safetyTitle:
      'No name or email is required. Individual replies are generally not provided.',
    points: [
      'Use the large free-text field for anything you noticed. If known, what you were doing, what happened, and what you hoped would happen can help with review.',
      'Do not include personal information, secrets, passwords, authentication codes, URLs, or information about another person. The app never attaches calculations or settings automatically.',
      'Your text is received through Google Forms to understand issues and feedback, maintain safety, and improve the app. Useful reports are intended to inform improvements within roughly one month, without a guarantee that every message will be understood or addressed, a deadline, or an individual reply.',
    ],
    processing:
      'Original responses are not passed directly to external AI. The intended process uses AI when needed to organize safely produced improvement candidates without personal information or original text. AI organization of real submissions has not started. Before text is provided to a new external AI service, its handling will be explained and any required consent obtained. Earlier responses will not automatically be reused.',
    testFlight:
      'TestFlight participants can use its feedback feature. For privacy requests, open this app’s page in TestFlight and select App Details in the Information section to find the developer email.',
    consent:
      'Submission is optional. Read the Privacy Policy for the purposes, international handling, retention, and deletion. Press Submit if you agree to transmission and storage through Google LLC in the United States and the international handling described here.',
    formTitle: 'Write freely',
    open: 'Open the form in a separate page',
    google:
      'There is no name or email field, and email addresses are not automatically collected. Anonymity is not guaranteed if someone writes identifying information themselves. Google Forms is provided by Google LLC in the United States. Information may be processed around the world, including the United States; the developer cannot specify or identify the countries used for each response. US participation in the Global CBPR Forum does not guarantee laws identical to Japan’s or any specific Google certification. Google describes encryption and access restrictions and also handles information for service provision, improvement, safety, and legal requests. Responses are kept only while needed, then deleted, not solely on a fixed schedule. For requests such as deletion, use Contact with the approximate submission time and a non-sensitive excerpt. A response may not be identifiable; this does not limit statutory rights.',
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
            : localizedAppRoute('en', featuredAppPaths.feedback)
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
            <p>{text.processing}</p>
            <p>{text.testFlight}</p>
            <p className="info-contact">
              <a href={localePath(locale, featuredAppPaths.privacy)}>
                {isEnglish ? 'Privacy Policy' : 'プライバシーポリシー'}
              </a>
            </p>
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
              <p>{text.google}</p>
              <p>{text.consent}</p>
              <p>{submissionNotice[locale]}</p>
              <iframe
                loading="lazy"
                referrerPolicy="no-referrer"
                src={embeddedUrl}
                title={`${featuredApp.name[locale]} — ${text.formTitle}`}
              />
              <p className="info-contact">
                <a href={localePath(locale, '/apps/contact/')}>
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
