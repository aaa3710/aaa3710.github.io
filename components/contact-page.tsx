import { ArrowLeft, ExternalLink, Mail, ShieldCheck } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import {
  contactFormUrl,
  formReadiness,
  submissionNotice,
} from '@/lib/feedback';
import { featuredAppPaths, localePath, type Locale } from '@/lib/site';
import { tsutawaruPaths } from '@/lib/tsutawaru';
import { locationLoggerPaths } from '@/lib/location-logger';

const content = {
  ja: {
    label: 'お問い合わせ',
    title: (
      <>
        業務・運営・その他の
        <span style={{ whiteSpace: 'nowrap' }}>ご連絡。</span>
      </>
    ),
    intro:
      '事業上の連絡、サイト運営、プライバシー・データの扱いに関する問い合わせは、この窓口で扱います。アプリの不具合や機能要望は、各アプリのサポートから専用フィードバックへお進みください。',
    back: 'アプリ一覧へ',
    appSupport: 'ピントと光 — 撮影計算のサポートへ',
    safetyLabel: '入力する内容',
    safetyTitle: '本文は必須です。連絡先は返信を希望する場合だけ。',
    points: [
      '用件を一つの本文欄へお書きください。返信が必要な場合だけ、返信可能な連絡先を任意で入力してください。',
      '用件や返信に不要な個人情報は入力しないでください。秘密情報、パスワード、認証コード、非公開の共有リンクは送らないでください。URLは用件に必要な公開ページに限ってください。',
      '送信内容と任意の連絡先はGoogleフォームを通じて保存され、問い合わせ対応と必要な返信に使い、不要になれば削除します。業務等の任意の問い合わせへの返信は保証していません。法令に基づくプライバシー上の権利に関する請求は、適用される法令に従って対応します。',
    ],
    formTitle: 'お問い合わせフォーム',
    open: 'フォームを別画面で開く',
    google:
      'この窓口は匿名のアプリフィードバックとは別です。返信用の連絡先を入力した場合、その情報は問い合わせへの対応にだけ使用します。Googleのサービスを通じて送信・保存されます。',
  },
  en: {
    label: 'Contact',
    title: 'Business, site administration, and other inquiries.',
    intro:
      'This contact route handles business matters, site administration, and questions about privacy or data handling. For app bugs or feature requests, open the app’s support page to find its feedback form.',
    back: 'Back to all apps',
    appSupport: 'Support for Focus & Light — Photo Tools',
    safetyLabel: 'What to enter',
    safetyTitle:
      'A message is required. Contact details are optional for replies.',
    points: [
      'Write your inquiry in the message field. Add a reachable contact detail only if you would like a reply.',
      'Do not include personal information unrelated to the inquiry or reply, secrets, passwords, authentication codes, or private sharing links. Include a public page URL only when it is relevant to your inquiry.',
      'Your message and any optional contact detail are stored through Google Forms, used only to handle the inquiry and any needed reply, then deleted when no longer needed. Replies to general business inquiries are not guaranteed. Requests to exercise privacy rights are handled as required by applicable law.',
    ],
    formTitle: 'Contact form',
    open: 'Open the form in a separate page',
    google:
      'This route is separate from anonymous app feedback. If you provide contact details for a reply, they are used only to handle this inquiry. The submission is sent and stored through Google’s service.',
  },
} as const;

export function ContactPage({ locale }: { locale: Locale }) {
  const isEnglish = locale === 'en';
  const text = content[locale];
  const formUrl = contactFormUrl(locale);
  const embeddedUrl = contactFormUrl(locale, true);

  return (
    <main id="top" lang={locale}>
      <SiteHeader
        locale={locale}
        languageHref={isEnglish ? '/contact/' : '/en/contact/'}
      />

      <article className="feedback-page section">
        <a className="back-link" href={localePath(locale)}>
          <ArrowLeft aria-hidden="true" size={16} />
          {text.back}
        </a>

        <div className="feedback-intro">
          <div>
            <p className="section-label">{text.label}</p>
            <h1>{text.title}</h1>
            <p>{text.intro}</p>
            <p className="info-contact">
              <a href={localePath(locale, featuredAppPaths.support)}>
                {text.appSupport}
              </a>
              <a href={localePath(locale, tsutawaruPaths.support)}>
                {isEnglish
                  ? 'Support for Tsutawaru Moji'
                  : '伝わる文字のサポートへ'}
              </a>
              <a href={localePath(locale, locationLoggerPaths.support)}>
                {isEnglish
                  ? 'Support for LocationLogger'
                  : '道の記録のサポートへ'}
              </a>
            </p>
          </div>
          <Mail aria-hidden="true" />
        </div>

        {formReadiness.contact ? (
          <>
            <section
              className="feedback-safety"
              aria-labelledby="contact-safety"
            >
              <ShieldCheck aria-hidden="true" />
              <div>
                <p className="section-label">{text.safetyLabel}</p>
                <h2 id="contact-safety">{text.safetyTitle}</h2>
                <ul>
                  {text.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section
              className="feedback-form"
              aria-labelledby="contact-form-title"
            >
              <div className="feedback-form-heading">
                <h2 id="contact-form-title">{text.formTitle}</h2>
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
                title={text.formTitle}
              />
              <p>{text.google}</p>
            </section>
          </>
        ) : (
          <section className="form-pending" aria-labelledby="contact-pending">
            <h2 id="contact-pending">
              {isEnglish
                ? 'The contact form is being prepared.'
                : 'お問い合わせフォームを準備中です。'}
            </h2>
            <p>
              {isEnglish
                ? 'Inquiries and reply details cannot be submitted from this page yet. The form will appear here once its content and settings have been checked.'
                : '現在、このページから問い合わせや返信先を送信することはできません。フォームの内容と設定を確認した後、この場所に表示します。'}
            </p>
            <p>
              {isEnglish
                ? 'Contact is separate from app Feedback. A message will be required; contact details will be optional for a reply. Contact messages and reply details will not be reused for Feedback AI classification or development issue reports. Replies to ordinary inquiries are not guaranteed; requests under privacy law are handled in accordance with applicable law.'
                : 'アプリ専用Feedbackとは別の窓口です。本文を必須、返信を希望する場合の連絡先だけを任意とする予定です。本文と返信先をFeedbackのAI分類や開発課題へ流用しません。通常のご連絡への返信は保証しませんが、法令に基づくプライバシー請求には適用法令に従って対応します。'}
            </p>
          </section>
        )}
      </article>

      <SiteFooter locale={locale} />
    </main>
  );
}
