import { ArrowLeft } from 'lucide-react';
import { PublicDocument } from '@/components/public-document';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import {
  locationLogger,
  locationLoggerPaths,
  type LocationLoggerPageKind,
} from '@/lib/location-logger';
import { localePath, type Locale } from '@/lib/site';
import snapshot from '@/lib/location-logger-public.generated.json';

const copy = {
  ja: {
    release: 'App Store公開準備中です。まだダウンロードできません。',
    intake:
      'お問い合わせ・フィードバックは受付準備中です。現在は送信できません。',
    app: 'iPhoneとApple Watchの位置記録',
    support: 'サポート',
    privacy: 'プライバシー',
    feedback: 'フィードバックのご案内',
    contact: '業務・運営・プライバシーの連絡先',
    pendingTitle: 'フォームはまだ利用できません。',
    pending:
      '専用フォームの説明、情報の取扱い、実際の設定と受付試験が確認されるまで受付を開始しません。',
    feedbackBody:
      '不具合、困りごと、要望を自由な文章一欄で伝える専用窓口を準備しています。アプリ名、言語、種類、端末、OS、氏名、メールアドレスの再入力は求めません。有用な報告は概ね1か月以内に改善へ反映することを目指しますが、全件採用、個別返信、期限内の修正や公開は保証しません。AIによる半自動整理はまだ稼働していません。',
    safety:
      '位置、座標、住所、移動履歴、書き出しファイル、個人情報、秘密、パスワード、認証コード、URLを送らないでください。',
  },
  en: {
    release:
      'The App Store release is being prepared. The app is not available to download yet.',
    intake:
      'Contact and feedback intake are being prepared. Submissions are not available yet.',
    app: 'iPhone and Apple Watch location records',
    support: 'Support',
    privacy: 'Privacy',
    feedback: 'Feedback information',
    contact: 'Business, administration, and privacy contact',
    pendingTitle: 'The form is not available yet.',
    pending:
      'Intake will remain closed until the form explanation, data handling, actual settings, and an acceptance test have been checked.',
    feedbackBody:
      'A dedicated channel with one free-text field is being prepared for bugs, issues, and requests. It will not ask you to re-enter the app, language, category, device, OS, name, or email address. Useful reports will be targeted for improvement within about one month, but adoption, individual replies, or fixes and releases within that period are not guaranteed. AI-assisted organization is not operating yet.',
    safety:
      'Do not send locations, coordinates, addresses, travel history, exported files, personal information, secrets, passwords, authentication codes, or URLs.',
  },
} as const;

export function LocationLoggerPage({
  locale,
  kind,
}: {
  locale: Locale;
  kind: LocationLoggerPageKind;
}) {
  const text = copy[locale];
  const name = locationLogger.name[locale];
  const title = `${name} — ${text[kind]}`;
  return (
    <main id="top" lang={locale}>
      <SiteHeader
        locale={locale}
        languageHref={`${locale === 'ja' ? '/en' : ''}${locationLoggerPaths[kind]}`}
      />
      <article className="info-page section tsutawaru-page">
        <a
          className="back-link"
          href={localePath(
            locale,
            kind === 'app' ? '/' : locationLoggerPaths.app,
          )}
        >
          <ArrowLeft aria-hidden="true" size={16} />
          {kind === 'app'
            ? locale === 'ja'
              ? 'アプリ一覧'
              : 'All apps'
            : name}
        </a>
        <p className="section-label">{name}</p>
        <h1>{title}</h1>
        <div className="tsutawaru-status">
          <p>{text.release}</p>
          <p>{text.intake}</p>
        </div>
        <div className="info-contact">
          {kind !== 'support' && (
            <a href={localePath(locale, locationLoggerPaths.support)}>
              {text.support}
            </a>
          )}
          {kind !== 'privacy' && (
            <a href={localePath(locale, locationLoggerPaths.privacy)}>
              {text.privacy}
            </a>
          )}
          {kind === 'support' && (
            <a href={localePath(locale, locationLoggerPaths.feedback)}>
              {text.feedback}
            </a>
          )}
          {kind !== 'app' && (
            <a href={localePath(locale, '/contact/')}>{text.contact}</a>
          )}
        </div>
        {kind === 'feedback' ? (
          <div className="public-document">
            <section
              className="form-pending"
              aria-labelledby="location-logger-intake"
            >
              <h2 id="location-logger-intake">{text.pendingTitle}</h2>
              <p>{text.pending}</p>
            </section>
            <p>{text.feedbackBody}</p>
            <p>{text.safety}</p>
          </div>
        ) : (
          <PublicDocument
            body={snapshot.documents[locale][kind].body}
            kind={kind}
          />
        )}
      </article>
      <SiteFooter locale={locale} />
    </main>
  );
}
