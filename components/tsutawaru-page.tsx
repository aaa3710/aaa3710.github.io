import { localizedAppRoute } from '@/lib/app-routes';
import { AppPageHeader, AppSupportLinks } from '@/components/app-page-header';
import { appCatalog } from '@/lib/app-catalog';
import { ReadableText } from '@/components/readable-text';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import { PublicDocument } from '@/components/public-document';
import { type Locale } from '@/lib/site';
import { tsutawaruPaths, type TsutawaruPageKind } from '@/lib/tsutawaru';
import snapshot from '@/lib/tsutawaru-public.generated.json';

const copy = {
  ja: {
    headline: '話した言葉を、大きく見やすく',
    lead: '対面の会話をiPhoneの大きな文字で表示します。押している間だけ、またはタップで開始・終了。読みやすい文字サイズや向きを選べます。',
    release: 'App Store公開準備中です。まだダウンロードできません。',
    intake:
      'お問い合わせ・フィードバックは受付準備中です。現在は送信できません。',
    support: '使い方と困ったとき',
    privacy: 'プライバシー',
    feedback: 'フィードバックのご案内',
    contact: '業務・運営・プライバシーの連絡先',
    features: [
      [
        'まずは、iPhoneの中だけで。',
        '初期設定は端末内の文字起こしです。OpenAI APIキーやAPI料金は不要で、利用できないときに外部方式へ自動で切り替えません。',
      ],
      [
        '読み方を、自分に合わせる。',
        '文字の大きさ、横書き・縦書き、スクロール・自動縮小を選べます。日本語と英語の文字起こしに対応します。翻訳は行いません。',
      ],
      [
        '確定した文字を、あとから読む。',
        '確定した文章はiPhone内の履歴へ保存され、個別または一括で削除できます。音声は履歴へ保存しません。',
      ],
      [
        'OpenAIを使うかは、自分で選ぶ。',
        'OpenAI API・ハイブリッドは任意です。説明に同意して選んだ場合だけ、録音終了後の音声を利用者自身のAPIキーでOpenAIへ送ります。アプリは無料で配信予定ですが、API料金と通信料は利用者負担です。ChatGPTの契約とは別です。',
      ],
    ],
    extraTitle: 'Apple Watch入力・近くのiPhoneとの共有',
    extra:
      'いずれも試験機能です。Watchの音声はペアリング済みiPhoneで文字起こしします。近距離共有は話す側1台から見る側最大7台へ文字だけを送り、双方で相手を確認します。各アプリを前面で使う必要があり、実機での最終確認は未完了です。',
    safetyTitle: '録音や共有の前に',
    safety:
      '参加者全員へ知らせ、許可を得てください。自動文字起こしには誤りがあります。医療・緊急・契約などの重要な判断で、表示だけに頼らないでください。',
    feedbackBody:
      '不具合や要望を、自由な文章一欄で伝える専用窓口を準備しています。アプリ名、言語、種類、端末、OS、氏名、メールアドレスの再入力は求めず、原則として個別返信は行わない予定です。',
    feedbackSafety:
      '会話本文、録音、他の人の情報、医療情報、APIキー、パスワード、認証コード、URLを送らないでください。',
    ai: '開発者によるFeedbackのAI整理は現在未運用です。アプリ内の任意OpenAI文字起こしや、Googleによる通常のサービス処理とは別です。',
    pending:
      '保存期間、削除方法、国外での取り扱いと実際のフォーム設定を確認するまで受付を開始しません。',
  },
  en: {
    headline: 'Make conversations easier to read.',
    lead: 'See face-to-face conversations as large text on iPhone. Hold to talk, or tap to start and stop. Choose the text size and orientation that work for you.',
    release:
      'The App Store release is being prepared. The app is not available to download yet.',
    intake:
      'Contact and feedback intake are being prepared. Submissions are not available yet.',
    support: 'Getting started and help',
    privacy: 'Privacy',
    feedback: 'Feedback information',
    contact: 'Business, administration, and privacy contact',
    features: [
      [
        'Start on your iPhone, without an API key.',
        'On-device transcription is the default. It needs no OpenAI API key or API payment and does not automatically switch to an external method when unavailable.',
      ],
      [
        'Read in a way that suits you.',
        'Choose text size, horizontal or vertical writing, and scrolling or automatic shrinking. Transcription supports Japanese and English. The app does not translate between languages.',
      ],
      [
        'Read finalized text again later.',
        'Finalized text stays in history on your iPhone. Delete individual records or all history. Audio is not saved in history.',
      ],
      [
        'Choose whether to use OpenAI.',
        'OpenAI API and Hybrid are optional. Only after you consent to the explanation and select one of those methods is the completed recording sent to OpenAI using your own API key. The app is planned to be free; API and network charges are your responsibility and are separate from a ChatGPT subscription.',
      ],
    ],
    extraTitle: 'Apple Watch input and sharing with nearby iPhones',
    extra:
      'Both are experimental. Watch audio is transcribed on the paired iPhone. Nearby sharing sends text only from one speaking iPhone to up to seven viewing iPhones after both sides verify the connection. Each app must stay in the foreground. Final physical-device verification is not yet complete.',
    safetyTitle: 'Before recording or sharing',
    safety:
      'Tell every participant and obtain permission. Automatic transcription can be wrong. Do not rely on the display alone for medical, emergency, contractual, or other critical decisions.',
    feedbackBody:
      'A dedicated channel with one free-text field is being prepared for bugs and suggestions. It will not ask you to re-enter the app, language, category, device, OS, name, or email address. Individual replies are not normally planned.',
    feedbackSafety:
      'Do not send conversation text, recordings, information about other people, medical information, API keys, passwords, verification codes, or URLs.',
    ai: 'The developer does not currently use AI to organize Feedback. This is separate from optional OpenAI transcription in the app and ordinary processing by Google’s services.',
    pending:
      'Intake will stay closed until retention, deletion, handling outside Japan, and the actual form settings have been checked.',
  },
} as const;

export function TsutawaruPage({
  locale,
  kind,
}: {
  locale: Locale;
  kind: TsutawaruPageKind;
}) {
  const text = copy[locale];
  return (
    <main id="top" lang={locale}>
      <SiteHeader
        locale={locale}
        languageHref={localizedAppRoute(
          locale === 'ja' ? 'en' : 'ja',
          tsutawaruPaths[kind],
        )}
      />
      <article className="info-page section app-detail-page">
        <AppPageHeader
          app={appCatalog[1]}
          locale={locale}
          kind={kind}
          lead={kind === 'app' ? text.lead : undefined}
        />
        {kind === 'support' && (
          <AppSupportLinks app={appCatalog[1]} locale={locale} />
        )}
        {kind === 'feedback' && (
          <p className="intake-status">
            <ReadableText>{text.intake}</ReadableText>
          </p>
        )}
        {kind === 'app' ? (
          <>
            <p className="policy-date">
              {locale === 'ja'
                ? 'iPhone・iOS 17以降 ／ 日本語・英語 ／ 初回配信予定地域：日本'
                : 'iPhone · iOS 17 or later · Japanese and English · Initial release planned for Japan'}
            </p>
            <div className="info-sections">
              {text.features.map(([heading, body]) => (
                <section key={heading}>
                  <h2>
                    <ReadableText>{heading}</ReadableText>
                  </h2>
                  <p>
                    <ReadableText>{body}</ReadableText>
                  </p>
                </section>
              ))}
            </div>
            <div className="public-document">
              <details>
                <summary>
                  <h2>{text.extraTitle}</h2>
                </summary>
                <p>{text.extra}</p>
              </details>
              <h2>{text.safetyTitle}</h2>
              <p>{text.safety}</p>
            </div>
          </>
        ) : kind === 'feedback' ? (
          <div className="public-document">
            <section
              className="form-pending"
              aria-labelledby="tsutawaru-intake"
            >
              <h2 id="tsutawaru-intake">
                {locale === 'ja'
                  ? 'フォームはまだ利用できません。'
                  : 'The form is not available yet.'}
              </h2>
              <p>{text.pending}</p>
            </section>
            <p>{text.feedbackBody}</p>
            <p>{text.feedbackSafety}</p>
            <p>{text.ai}</p>
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
