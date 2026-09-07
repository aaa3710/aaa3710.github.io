import { ArrowLeft, ExternalLink, Mail, ShieldCheck } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import {
  contactFormUrl,
  formReadiness,
  submissionNotice,
} from '@/lib/feedback';
import { featuredAppPaths, localePath, type Locale } from '@/lib/site';
import { tsutawaruPaths } from '@/lib/tsutawaru';

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
    appSupport: '撮影のものさしのサポートへ',
    safetyLabel: '入力する内容',
    safetyTitle: '本文は必須です。連絡先は返信を希望する場合だけ。',
    points: [
      '用件を一つの本文欄へお書きください。返信が必要な場合だけ返信先メールを任意入力してください。本文と返信先をFeedbackのAI整理へ渡しません。',
      '不要な個人情報、身分証明書、秘密情報、パスワード、認証コード、機微情報、第三者の情報、非公開の共有リンクは送らないでください。URLは用件に必要な公開ページに限ってください。必要な本人確認は返信後に最小限の方法をご案内します。',
      '送信内容と任意の連絡先はGoogleフォームを通じて保存され、問い合わせ対応と必要な返信に使い、不要になれば削除します。業務等の任意の問い合わせへの返信は保証していません。法令に基づくプライバシー上の権利に関する請求は、適用される法令に従って対応します。',
    ],
    testFlight:
      'TestFlightで撮影のものさしをテストしている方は、TestFlightのフィードバック機能をご利用ください。プライバシーの請求は、TestFlightのこのアプリの情報欄にある「Appの詳細」で開発者メールを確認してお送りください。',
    consent:
      '送信は任意です。プライバシーポリシーでContactと国外処理の説明を確認し、米国のGoogle LLCへの送信・保存と、説明した国外での取扱いに同意する場合に「送信」を押してください。',
    formTitle: 'お問い合わせフォーム',
    open: 'フォームを別画面で開く',
    google:
      '本文と任意の返信先は用件・請求への対応と必要な返信にだけ使い、FeedbackのAI整理へ渡しません。目的に必要な間だけ保持し、不要になれば削除します。周期だけを理由に一律削除しません。メールで返信する場合、その相手には送信者の名前・メールアドレス等が表示されます。Google Formsの提供者は米国のGoogle LLCです。情報は米国を含む世界各地で処理される場合があり、開発者は個々の保存・処理国を指定・特定できません。米国のGlobal CBPR Forum参加は、日本と同じ制度やGoogleの個別認証を保証しません。Googleは暗号化・アクセス制限等を説明し、サービス提供・改善・安全確保や法的要請等でも情報を扱います。',
  },
  en: {
    label: 'Contact',
    title: 'Business, site administration, and other inquiries.',
    intro:
      'This contact route handles business matters, site administration, and questions about privacy or data handling. For app bugs or feature requests, open the app’s support page to find its feedback form.',
    back: 'Back to all apps',
    appSupport: 'Support for Photo Yardstick',
    safetyLabel: 'What to enter',
    safetyTitle:
      'A message is required. Contact details are optional for replies.',
    points: [
      'Write your inquiry in the message field. Add a reply email only if you need a response. Contact messages and reply details are not used for Feedback AI organization.',
      'Do not send unnecessary personal information, identity documents, secrets, passwords, authentication codes, sensitive information, information about another person, or private sharing links. Include a public URL only when needed for the inquiry. Any necessary identity check will be explained in a reply using the minimum information needed.',
      'Your message and any optional contact detail are stored through Google Forms, used only to handle the inquiry and any needed reply, then deleted when no longer needed. Replies to general business inquiries are not guaranteed. Requests to exercise privacy rights are handled as required by applicable law.',
    ],
    testFlight:
      'If you are testing Photo Yardstick with TestFlight, use TestFlight’s feedback feature. For privacy requests, open this app’s page in TestFlight and select App Details in the Information section to find the developer email.',
    consent:
      'Submission is optional. Read the Privacy Policy’s Contact and international-processing information. Press Submit if you agree to transmission and storage through Google LLC in the United States and the international handling described here.',
    formTitle: 'Contact form',
    open: 'Open the form in a separate page',
    google:
      'Your message and optional reply email are used only to handle the inquiry or request and any necessary reply, not for Feedback AI organization. They are kept only while needed, then deleted, not solely on a fixed schedule. An email reply reveals the sender’s name, email address, and related information to its recipient. Google Forms is provided by Google LLC in the United States. Information may be processed around the world, including the United States; the developer cannot specify or identify the countries used for each response. US participation in the Global CBPR Forum does not guarantee laws identical to Japan’s or any specific Google certification. Google describes encryption and access restrictions and also handles information for service provision, improvement, safety, and legal requests.',
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
        languageHref={isEnglish ? '/apps/contact/' : '/apps/en/contact/'}
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
            <p>{text.testFlight}</p>
            <p className="info-contact">
              <a href={localePath(locale, featuredAppPaths.privacy)}>
                {isEnglish
                  ? 'Privacy and international handling'
                  : 'プライバシーと国外での取扱い'}
              </a>
            </p>
            <p className="info-contact">
              <a href={localePath(locale, featuredAppPaths.support)}>
                {text.appSupport}
              </a>
              <a href={localePath(locale, tsutawaruPaths.support)}>
                {isEnglish
                  ? 'Support for Tsutawaru Moji'
                  : '伝わる文字のサポートへ'}
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
              <p>{text.google}</p>
              <p>{text.consent}</p>
              <p>{submissionNotice[locale]}</p>
              <iframe
                loading="lazy"
                referrerPolicy="no-referrer"
                src={embeddedUrl}
                title={text.formTitle}
              />
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
