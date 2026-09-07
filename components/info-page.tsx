import { localizedAppRoute } from '@/lib/app-routes';
import { ArrowLeft } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import { formReadiness } from '@/lib/feedback';
import {
  featuredApp,
  featuredAppPaths,
  localePath,
  publicSupportEmail,
  type Locale,
} from '@/lib/site';

type InfoKind = 'privacy' | 'support';

const info = {
  ja: {
    privacy: {
      label: '撮影のものさしのプライバシー',
      title: 'アプリがデータを勝手に送ることはありません。',
      intro:
        '「撮影のものさし」本体は、個人情報、位置情報、写真、連絡先、識別子、利用状況、診断情報を収集しません。',
      sections: [
        [
          'アプリからの通信',
          'アカウント、広告、解析SDK、追跡はありません。計算値や設定を外部サーバーへ自動送信しません。利用者がフィードバックを選んだ場合だけ、外部Webページを開きます。',
        ],
        [
          'iPhone内に保存する設定',
          '表示言語、撮影機材、レンズ・センサー・解像度・絞り・距離・許容錯乱円・グラフ表示、実寸表示の校正値を、このiPhone内のアプリ設定として保存します。アプリが独自に自動送信・同期したり、販売したりすることはありません。利用者がiCloudバックアップなどのOS機能を有効にしている場合は、Appleの仕組みでバックアップ対象になり得ます。',
        ],
        [
          '削除',
          '機材や表示プリセットはアプリ内で削除できます。アプリを削除すると、このiPhone内でアプリが保持する設定も削除されます。iOSの「Appを取り除く」はデータを残す別の操作です。また、端末のバックアップや、利用者が自分で送信したフィードバックはアプリ内の削除操作の対象外です。',
        ],
        [
          '自分でフィードバックを送る場合',
          formReadiness['app-feedback']
            ? 'アプリ専用フィードバックはGoogleフォームを使用し、氏名やメールアドレスを収集しません。自由記述欄へ入力した本文はGoogleのサービスを通じて送信・保存され、開発者が確認します。回答は不具合・意見の確認と改善に必要な間だけ保持し、不要になれば削除します。AIによる整理を行う場合は、説明を更新し、必要な同意を得た範囲で行います。過去の回答を自動で流用しません。アプリ本体が計算値や設定を添付することはありません。'
            : '専用フィードバックフォームは準備中で、このサイトからは送信できません。公開前に、氏名・メールアドレスを収集しない自由記述1欄の設定と説明を確認します。アプリ本体が計算値や設定を添付することはありません。',
        ],
        [
          '同意と削除の依頼',
          formReadiness.contact
            ? '送信ボタンを押さなければ、開発者へ回答としては届きません。Google側での下書き保存や通常のWeb情報処理は別です。投稿済みの回答の削除など、プライバシーに関する依頼はお問い合わせ窓口へお送りください。おおよその送信日時と個人情報を含まない本文の一部から回答を確実に特定できた場合に対応します。匿名回答は特定できない場合があります。返信が必要な場合だけ連絡先を任意で入力できます。'
            : 'プライバシーや投稿済み回答の削除に関するお問い合わせ窓口も準備中で、現在はこのサイトから依頼を送信できません。なお、Googleフォームの送信ボタンを押さなければ開発者へ回答としては届きませんが、Google側での下書き保存や通常のWeb情報処理は別です。',
        ],
        [
          '外部Webページ',
          'このサイトはGitHub Pages、アプリ専用フィードバックとお問い合わせはGoogle Formsを利用しています。ページを開くと、各事業者がIPアドレス、ブラウザや端末の情報など通常の接続情報を、それぞれのプライバシーポリシーに従って取り扱う場合があります。',
        ],
        [
          '変更と問い合わせ',
          '機能やデータの扱いを変更した場合は、この文面とApp Store上の情報を更新します。アプリの不具合・改善案は専用フィードバック、プライバシーやデータの扱いに関する連絡は別のお問い合わせ窓口で扱います。各窓口の受付状況はリンク先で案内します。',
        ],
      ],
      date: '適用日: 初回リリース日',
    },
    support: {
      label: '撮影のものさしのサポート',
      title: '計算結果の見方と、できないこと。',
      intro:
        '「撮影のものさし」の数値は、撮影前の判断を助けるための目安です。結果に影響する前提と、現在の計算に含まれないものをまとめています。',
      sections: [
        [
          'ピントが合って見える範囲',
          '薄い一枚のレンズとして考え、レンズとセンサーが平行という近似に基づきます。回折、レンズの収差、手ぶれ、被写体の動き、画像処理などは計算に含みません。',
        ],
        [
          '露出の計算',
          '絞り、シャッター速度、被写体の明るさ、感度をAPEXという関係で計算します。実際のカメラや露出計と完全に一致することは保証しません。',
        ],
        [
          '大判・接写の露出補正',
          '蛇腹を伸ばしたときの露出倍率、補正段数、実効F値を扱います。レンズや撮像面を傾けた場合のピント範囲は計算しません。',
        ],
        [
          '重要な撮影',
          '試し撮り、カメラの表示、露出計でも確認してください。このアプリの計算だけに頼らないでください。',
        ],
      ],
    },
  },
  en: {
    privacy: {
      label: 'Photo Yardstick privacy',
      title: 'The app does not send your data anywhere automatically.',
      intro:
        'Photo Yardstick does not collect personal information, location, photos, contacts, identifiers, usage data, or diagnostics.',
      sections: [
        [
          'Communication from the app',
          'There is no account system, advertising, analytics SDK, or tracking. The app never transmits calculations or settings to an external server automatically. It opens an external web page only when the user chooses to send feedback.',
        ],
        [
          'Settings stored on your iPhone',
          'Language choice, equipment, lens, sensor, resolution, aperture, distance, circle-of-confusion and graph settings, and physical-display calibration are stored locally in the app settings on this iPhone. The app does not independently transmit, sync, or sell them. If you enable an OS feature such as iCloud Backup, Apple may include them in a backup.',
        ],
        [
          'Deletion',
          'Equipment and display presets can be deleted inside the app. Deleting the app deletes the settings it holds on this iPhone. Offloading an app is a separate iOS action that keeps its data. App controls also do not delete device backups or feedback that you chose to submit.',
        ],
        [
          'When you choose to send feedback',
          formReadiness['app-feedback']
            ? 'The app-specific feedback page uses Google Forms and does not collect names or email addresses. Text entered in the free-text field is sent and stored through Google’s service and reviewed by the developer. Responses are retained only while needed to review issues and feedback and improve the app, then deleted. Before any AI-assisted organization, the explanation will be updated and any required consent obtained. Previous responses will not be reused automatically. The app does not attach calculation values or settings.'
            : 'The app-specific feedback form is being prepared, and submissions are not available from this site yet. Before it is enabled, its explanation and single free-text field will be checked to ensure it does not collect names or email addresses. The app does not attach calculation values or settings.',
        ],
        [
          'Consent and deletion requests',
          formReadiness.contact
            ? 'Until you press Submit, the developer does not receive your text as a response. Google’s draft saving and ordinary web processing are separate. Use Contact for privacy requests, including deletion of a previous response. A request can be handled if the response can be identified reliably from its approximate submission time and a non-sensitive text fragment. An anonymous response may not be identifiable. Add contact details only if you would like a reply.'
            : 'The contact route for privacy questions and deletion of previous responses is also being prepared, so requests cannot be sent from this site yet. Until you press Submit on a Google Form, the developer does not receive your text as a response; Google’s draft saving and ordinary web processing are separate.',
        ],
        [
          'External web pages',
          'This site uses GitHub Pages, while app-specific feedback and contact use Google Forms. When you open those pages, each provider may process ordinary connection information, such as your IP address and browser or device information, under its own privacy policy.',
        ],
        [
          'Changes and questions',
          'If features or data practices change, this policy and the App Store disclosure will be updated. App feedback handles bugs and suggestions; the separate Contact route handles privacy and data matters. Each linked page shows whether submissions are available.',
        ],
      ],
      date: 'Effective date: initial release date',
    },
    support: {
      label: 'Photo Yardstick support',
      title: 'How to read the results, and what they do not cover.',
      intro:
        'Photo Yardstick results are guides for decisions before a photograph. This page summarizes the assumptions that affect the numbers and what is outside the current model.',
      sections: [
        [
          'The range that appears acceptably sharp',
          'The calculation uses a thin-lens approximation with parallel lens and image planes. Diffraction, lens aberrations, camera shake, subject movement, and image processing are outside the model.',
        ],
        [
          'Exposure calculations',
          'Aperture, shutter speed, scene brightness, and sensitivity are related through APEX. Results are not guaranteed to match a particular camera or light meter exactly.',
        ],
        [
          'Large-format and close-up compensation',
          'The bellows tool covers exposure factor, stop compensation, and effective f-number. It does not calculate the focus range when the lens or image plane is tilted.',
        ],
        [
          'Important photographs',
          'Also verify with a test image, equipment display, and light meter. Do not rely on this app’s calculation alone.',
        ],
      ],
    },
  },
} as const;

export function InfoPage({ locale, kind }: { locale: Locale; kind: InfoKind }) {
  const isEnglish = locale === 'en';
  const page = info[locale][kind];

  return (
    <main id="top" lang={locale}>
      <SiteHeader
        locale={locale}
        languageHref={
          isEnglish
            ? featuredAppPaths[kind]
            : localizedAppRoute('en', featuredAppPaths[kind])
        }
      />
      <article className="info-page section">
        <a
          className="back-link"
          href={localePath(locale, featuredAppPaths.app)}
        >
          <ArrowLeft aria-hidden="true" size={16} />
          {featuredApp.name[locale]}
        </a>
        <p className="section-label">{page.label}</p>
        <h1>{page.title}</h1>
        <p className="info-intro">{page.intro}</p>

        {kind === 'support' ? (
          <p className="info-contact">
            <a href={localePath(locale, featuredAppPaths.feedback)}>
              {formReadiness['app-feedback']
                ? isEnglish
                  ? 'Send a bug report or suggestion'
                  : '不具合・要望を送る'
                : isEnglish
                  ? 'Feedback information'
                  : 'フィードバックのご案内'}
            </a>
            {publicSupportEmail ? (
              <a href={`mailto:${publicSupportEmail}`}>{publicSupportEmail}</a>
            ) : null}
          </p>
        ) : null}

        <div className="info-sections">
          {page.sections.map(([title, body]) => (
            <section key={title}>
              <h2>{title}</h2>
              <p>{body}</p>
            </section>
          ))}
        </div>

        {kind === 'privacy' ? (
          <p className="policy-links">
            <a
              href="https://policies.google.com/privacy"
              rel="noreferrer"
              target="_blank"
            >
              {isEnglish
                ? 'Google Privacy Policy'
                : 'Google プライバシーポリシー'}
            </a>
            <a
              href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement"
              rel="noreferrer"
              target="_blank"
            >
              {isEnglish
                ? 'GitHub General Privacy Statement'
                : 'GitHub 一般プライバシーステートメント'}
            </a>
          </p>
        ) : null}

        {kind === 'privacy' ? (
          <p className="info-contact">
            <a href={localePath(locale, featuredAppPaths.support)}>
              {isEnglish ? 'App support' : 'アプリのサポートへ'}
            </a>
            <a href={localePath(locale, '/apps/contact/')}>
              {isEnglish
                ? 'Contact about privacy or data handling'
                : 'プライバシー・データ取扱いを問い合わせる'}
            </a>
          </p>
        ) : null}

        {'date' in page ? <p className="policy-date">{page.date}</p> : null}
      </article>
      <SiteFooter locale={locale} />
    </main>
  );
}
