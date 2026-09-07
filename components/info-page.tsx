import { localizedAppRoute } from '@/lib/app-routes';
import { AppPageHeader, AppSupportLinks } from '@/components/app-page-header';
import { appCatalog } from '@/lib/app-catalog';
import { ReadableText } from '@/components/readable-text';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import { formReadiness } from '@/lib/feedback';
import { featuredAppPaths, localePath, type Locale } from '@/lib/site';

type InfoKind = 'privacy' | 'support';

const info = {
  ja: {
    privacy: {
      label: '撮影のものさしのプライバシー',
      title: 'データの保存と、外部サービスでの取扱い。',
      intro:
        '撮影のものさし本体は計算値や設定を端末内に保存し、自動送信しません。TestFlightでのテストと、自分で開くWebページやフォームでの取扱いを、それぞれ説明します。',
      sections: [
        [
          '運営者と問い合わせ',
          '運営者は、TestFlightまたはApp Storeに開発者・販売者として表示される個人開発者です。共通Contactはプライバシーの質問や法令上の請求を扱います。受付状況はリンク先で案内し、準備中の窓口からは送信できません。TestFlight参加者は、TestFlightに表示される開発者の連絡先メールでもお問い合わせいただけます。法令により必要な正当な請求には、運営者住所を遅滞なく開示します。電話番号と連絡用メールは一般のWebページへ掲載しません。メールで返信する場合、その相手には送信者の名前・メールアドレス等が表示されます。',
        ],
        [
          'アプリ本体',
          'アカウント、広告、解析SDK、追跡、独自の通信・同期機能はありません。本体は個人情報、位置情報、写真、連絡先、識別子、利用状況、診断情報を収集せず、計算値や設定を自動送信しません。プライバシー、サポート、フィードバックのリンクを選ぶと外部ブラウザでページを開きますが、計算値・設定・端末識別子をURL等へ付けません。',
        ],
        [
          'iPhone内の設定と削除',
          '表示言語、撮影機材、レンズ・センサー・解像度・絞り・距離・許容錯乱円・グラフ表示、実寸表示の校正値を、このiPhoneのアプリ設定へ保存します。機材や表示プリセットは一覧から削除できますが、設定の破損に備えた復旧用コピーが端末内に残る場合があります。iOSの「Appを削除」はこのiPhone上の設定も削除します。「Appを取り除く」は設定を残す別の操作です。OSや利用者が作成する端末バックアップには設定が含まれる場合があり、既存バックアップはアプリから削除されません。',
        ],
        [
          'TestFlightでテストする場合',
          'TestFlightでは、Appleがクラッシュ情報と利用状況を自動収集し、開発者へ共有します。任意で送るコメントやスクリーンショットも共有され、招待方法や入力内容によっては氏名・メールアドレスが含まれます。開発者はテスト確認と改善に必要な間だけ扱い、第三者へ共有しません。TestFlight由来の情報をGoogle Formsや外部AIへ転送しません。Apple自身の保持・利用・管理方法は、下記のAppleの案内をご確認ください。',
        ],
        [
          'TestFlightの連絡先',
          'TestFlight参加者は、TestFlightのフィードバック機能をご利用ください。プライバシーの質問や法令上の請求は、TestFlightでこのアプリを開き、情報欄の「Appの詳細」に表示される開発者のメールアドレスへお送りください。TestFlight由来のコメント・画面・クラッシュ情報等をGoogleフォームへ転送しないでください。',
        ],
        [
          '一般フィードバック',
          (formReadiness['app-feedback']
            ? '専用フィードバックを受け付けています。'
            : '専用フィードバックフォームは準備中で、現在は送信できません。') +
            '氏名・メールアドレスを回答項目として要求せず、メールを自動収集しない自由記述欄1つです。個人情報、秘密情報、認証情報、URL、第三者情報は入力しないでください。自分で識別情報を書いた場合まで匿名性を保証するものではありません。不具合・ご意見の把握、安全確認、アプリ改善のために受け取り、安全に扱える改善候補を必要時に整理します。有用な報告は概ね1か月以内の改善につなげることを目指しますが、全件の内容把握・対応、期限、個別返信は保証しません。実回答のAI整理はまだ開始していません。新たな外部AIへ本文を渡す場合は開始前に送信先・処理方法を案内し、必要な同意を得ます。以前の回答を当然には流用しません。',
        ],
        [
          '共通Contact',
          '業務・運営の連絡、プライバシーの質問・苦情、運営者住所の開示、法令上の開示・訂正・削除・利用停止等を、専用Feedbackと分けて扱います。本文は必須、返信先メールは返信を希望する場合だけ任意です。用件の確認と必要な返信に使い、Contact本文と返信先をFeedbackのAI整理へ渡しません。一般の問い合わせへの返信は保証しませんが、法令上の権利請求には適用法令に従って対応します。',
        ],
        [
          '外部WebページとGoogleでの国外の取扱い',
          'サイトはGitHub Pages、フォームは米国のGoogle LLCが提供するGoogle Formsを使います。各事業者はIPアドレス、ブラウザ・端末情報、Cookieなど通常のWeb情報を各社のポリシーに従って扱う場合があります。Googleでは、送信内容とWeb情報が米国を含む世界各地の設備で処理される場合があり、開発者は個々の回答の保存・処理国を指定・特定できません。個人向けGoogleサービスの利用規約とプライバシーポリシーが適用されます。',
        ],
        [
          '米国の制度とGoogleの措置',
          '米国はGlobal CBPR Forumの参加国です。国際的な個人情報保護の枠組みへの参加を示すもので、日本と同じ制度やGoogleの個別認証を保証しません。Googleは通信時の暗号化、アクセス制限、守秘義務、削除等の仕組みを説明しています。Google自身はサービスの提供・維持・改善・安全確保等でも情報を扱い、関連会社・委託先や法的要請に対応する共有を行う場合があります。下記のGoogleとGlobal CBPRの資料をご確認ください。',
        ],
        [
          '送信への同意',
          '送信は任意です。フォームは利用目的とこの説明を送信前に示します。Google LLCへの送信・保存と、説明した国外での取扱いに同意する場合に「送信」を押してください。送信しなければ開発者へ回答としては届きませんが、Google自身のWeb情報処理は別です。準備中のフォームからは送信できません。',
        ],
        [
          '保持・削除と安全管理',
          '回答は目的に必要な間だけ保持し、不要になれば削除します。周期だけを理由に一律削除しません。回答へのアクセスを制限し、本文を通常の開発記録や操作権限を持つAIへ複製しません。公開前にログイン不要、メール自動収集なし、回答概要非公開、回答者の下書き自動保存無効を確認します。GoogleやGitHubのWeb情報の保持・削除は各社の仕組みに従います。',
        ],
        [
          '削除の依頼と変更',
          '削除などのご依頼は、共通Contactの受付状況を確認し、おおよその送信日時と秘密でない本文の一部をお知らせください。氏名等を要求しない回答は、確実に特定できない場合があります。法令上必要な本人確認や追加情報は必要最小限で個別にご案内します。この識別方法は法令上の権利を制限しません。説明や実際の取扱いを変更した場合、このポリシーと必要なアプリ内・App Store上の情報を更新します。',
        ],
      ],
      date: '文面の更新日: 2026年9月7日',
    },
    support: {
      label: '撮影のものさしのサポート',
      title: '計算結果の見方と、できないこと。',
      intro:
        '「撮影のものさし」の数値は、撮影前の判断を助けるための目安です。結果に影響する前提と、現在の計算に含まれないものをまとめています。',
      sections: [
        [
          '不具合や気づいたこと',
          '設定の「不具合・ご意見を送る」から専用フィードバックの受付状況を確認できます。受付中は自由記述欄1つへ、気づいたことと、分かれば操作・起きたこと・期待したことをお書きください。本体は計算値や設定を添付しません。個人情報、秘密情報、認証情報、URL、第三者の情報は送らないでください。有用な報告は概ね1か月以内の改善につなげることを目指しますが、全件対応・期限・個別返信は保証しません。',
        ],
        [
          'TestFlight参加者の連絡先',
          'TestFlight参加者は、TestFlightのフィードバック機能をご利用ください。プライバシーの質問や法令上の請求は、TestFlightでこのアプリを開き、情報欄の「Appの詳細」に表示される開発者のメールアドレスへお送りください。TestFlight由来のコメント・画面・クラッシュ情報等をGoogleフォームへ転送しないでください。',
        ],
        [
          '業務・プライバシーの問い合わせ',
          '業務・運営、プライバシーの質問・苦情、運営者住所の開示、法令上の開示・訂正・削除・利用停止等は、専用Feedbackとは別の共通Contactで扱います。受付状況はリンク先でご確認ください。返信が必要な場合だけ返信先メールを任意入力できます。一般の問い合わせへの返信は保証しませんが、法令上の権利請求には適用法令に従って対応します。送信前にプライバシーポリシーで、Googleによる国外処理、利用目的、実際のAI利用、保持・削除と同意の説明をご確認ください。',
        ],
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
      title: 'How settings, testing, and messages are handled.',
      intro:
        'Photo Yardstick itself stores calculations and settings on your device without automatically sending them. Testing through TestFlight and the web pages or forms you choose to open are explained separately below.',
      sections: [
        [
          'Operator and contact routes',
          'The operator is the individual developer or seller identified in TestFlight or on the App Store. Contact handles privacy questions and statutory requests. Each linked route shows its availability; a route marked as being prepared cannot accept submissions. TestFlight participants can also use the developer email shown in TestFlight. The operator will disclose a postal address without delay in response to a legitimate request where required by law. A phone number and contact email are not published on the general website. An email reply reveals the sender’s name, email address, and related information to its recipient.',
        ],
        [
          'The app itself',
          'There is no account system, advertising, analytics SDK, tracking, or proprietary network or sync service. The app itself does not collect personal information, location, photos, contacts, identifiers, usage data, or diagnostics, or automatically transmit calculations or settings. Selecting a privacy, support, or feedback link opens a page in your external browser without adding calculations, settings, or device identifiers to the URL or submission.',
        ],
        [
          'Settings on your iPhone and deletion',
          'Language, equipment, lens, sensor, resolution, aperture, distance, circle-of-confusion and graph settings, and physical-display calibration are stored in this iPhone’s app settings. Equipment and display presets can be removed from the list, but recovery copies may remain locally in case settings become damaged. Delete App in iOS also removes this app’s settings from the iPhone. Offload App is a different action that keeps them. Device backups made by the OS or user may include settings; the app cannot delete existing backups.',
        ],
        [
          'Testing with TestFlight',
          'In TestFlight, Apple automatically collects crash and usage information and shares it with the developer. Comments and screenshots you choose to submit are also shared; your name or email may be included depending on the invitation method and information you provide. The developer handles these data only while needed to evaluate and improve the app and does not share them with third parties. TestFlight data are not forwarded to Google Forms or external AI. See Apple’s notice below for Apple’s retention, use, and data controls.',
        ],
        [
          'Contacting the developer through TestFlight',
          'TestFlight participants can use TestFlight’s feedback feature. For privacy questions or statutory requests, open this app’s page in TestFlight, select App Details in the Information section, and contact the developer at the email shown there. Do not forward TestFlight comments, screenshots, crash information, or other TestFlight data to Google Forms.',
        ],
        [
          'General feedback',
          (formReadiness['app-feedback']
            ? 'App-specific feedback is open. '
            : 'The app-specific feedback form is being prepared and cannot accept submissions yet. ') +
            'It uses one free-text field without requesting a name or email field or automatically collecting email addresses. Do not include personal information, secrets, credentials, URLs, or information about another person. Anonymity is not guaranteed if someone writes identifying information themselves. Feedback is received to understand issues and suggestions, maintain safety, and improve the app, with safe improvement candidates organized when needed. Useful reports are intended to inform improvements within roughly one month, without a guarantee that every message will be understood or addressed, a deadline, or an individual reply. AI organization of real submissions has not started. Before text is provided to a new external AI service, its destination and processing will be explained and any required consent obtained. Earlier responses will not automatically be reused.',
        ],
        [
          'Shared Contact route',
          'Contact handles business and administration, privacy questions and complaints, requests for the operator’s address, and applicable access, correction, deletion, or cessation-of-use requests separately from app Feedback. A message is required; a reply email is optional when you need a response. These details are used to handle the inquiry and any necessary reply. Contact messages and reply details are not used for Feedback AI organization. Replies to ordinary inquiries are not guaranteed; statutory requests are handled under applicable law.',
        ],
        [
          'External web pages and Google’s international handling',
          'The site uses GitHub Pages, and forms use Google Forms, provided by Google LLC in the United States. Providers may handle ordinary web information such as IP addresses, browser or device details, and cookies under their own policies. Google may process submissions and web information in facilities around the world, including the United States. The developer cannot specify or identify the actual countries used for each response. Google’s consumer terms and privacy policy apply.',
        ],
        [
          'The US framework and Google’s safeguards',
          'The United States participates in the Global CBPR Forum, an international privacy framework. This does not guarantee laws identical to Japan’s or any particular Google certification. Google describes encryption in transit, access restrictions, confidentiality requirements, and deletion controls. Google also handles information for service provision, maintenance, improvement, and safety, and may share information with affiliates, service providers, or in response to legal requirements. See the Google and Global CBPR resources below.',
        ],
        [
          'Consent to submission',
          'Submission is optional. Forms show their purpose and this information before submission. Press Submit if you agree to transmission and storage through Google LLC and the international handling described here. Until you submit, the developer does not receive a response; Google’s own web processing is separate. Forms marked as being prepared cannot accept submissions.',
        ],
        [
          'Retention, deletion, and safeguards',
          'Responses are kept only while needed for their purpose, then deleted. They are not deleted solely on a fixed schedule. Access is restricted; original text is not copied into routine development records or AI with tool permissions. Before opening a form, its settings are checked for no required sign-in, no automatic email collection, no public response summaries, and disabled respondent draft autosave. Google’s and GitHub’s retention and deletion of web information follow their own systems.',
        ],
        [
          'Deletion requests and changes',
          'For requests such as deletion, check Contact for availability and provide the approximate submission time and a non-sensitive excerpt. A response that does not request identity may not be identifiable with confidence. Any legally necessary identity checks or additional details will be requested individually and kept to a minimum. This identification method does not limit statutory rights. If the explanation or actual practices change, this policy and relevant in-app and App Store information will be updated.',
        ],
      ],
      date: 'Policy text updated: September 7, 2026',
    },
    support: {
      label: 'Photo Yardstick support',
      title: 'How to read the results, and what they do not cover.',
      intro:
        'Photo Yardstick results are guides for decisions before a photograph. This page summarizes the assumptions that affect the numbers and what is outside the current model.',
      sections: [
        [
          'Issues and anything you noticed',
          'Send Feedback in Settings opens the app-specific feedback page to show availability. When submissions are open, use its one free-text field to explain what you noticed and, if known, your actions, what happened, and what you expected. The app does not attach calculations or settings. Do not include personal information, secrets, credentials, URLs, or information about another person. Useful reports are intended to inform improvements within roughly one month; handling every report, deadlines, and individual replies are not guaranteed.',
        ],
        [
          'Contact for TestFlight participants',
          'TestFlight participants can use TestFlight’s feedback feature. For privacy questions or statutory requests, open this app’s page in TestFlight, select App Details in the Information section, and contact the developer at the email shown there. Do not forward TestFlight comments, screenshots, crash information, or other TestFlight data to Google Forms.',
        ],
        [
          'Business and privacy inquiries',
          'The separate Contact route handles business and administration, privacy questions and complaints, requests for the operator’s address, and applicable access, correction, deletion, or cessation-of-use requests. Check the linked page for availability. A reply email is optional when you need a response. Replies to ordinary inquiries are not guaranteed; statutory requests are handled under applicable law. Before submitting, read the Privacy Policy for Google’s international handling, purposes, actual AI use, retention, deletion, and consent information.',
        ],
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
      <article className="info-page section app-detail-page">
        <AppPageHeader
          app={appCatalog[0]}
          locale={locale}
          kind={kind}
          lead={page.intro}
        />
        {kind === 'support' && (
          <AppSupportLinks
            app={appCatalog[0]}
            locale={locale}
            ready={formReadiness['app-feedback']}
          />
        )}

        <div className="public-document">
          {page.sections.map(([title, body], index) => (
            <details key={title} open={index < (kind === 'privacy' ? 1 : 2)}>
              <summary aria-label={title}>
                <h2>
                  <ReadableText>{title}</ReadableText>
                </h2>
              </summary>
              <p>
                <ReadableText>{body}</ReadableText>
              </p>
            </details>
          ))}
        </div>

        {kind === 'privacy' ? (
          <p className="policy-links">
            <a
              href="https://www.apple.com/legal/privacy/data/en/test-flight/"
              rel="noreferrer"
              target="_blank"
            >
              {isEnglish
                ? 'Apple’s TestFlight & Privacy'
                : 'AppleのTestFlightとプライバシー'}
            </a>
            <a
              href="https://testflight.apple.com/"
              rel="noreferrer"
              target="_blank"
            >
              {isEnglish
                ? 'Using TestFlight and contacting the developer'
                : 'TestFlightの使い方・開発者への連絡'}
            </a>
            <a
              href={`https://policies.google.com/terms/information-requests?hl=${locale}`}
              rel="noreferrer"
              target="_blank"
            >
              {isEnglish
                ? 'Government information requests to Google'
                : 'Googleへの公的機関の情報開示要請'}
            </a>
            <a
              href="https://www.globalcbpr.org/about/membership/"
              rel="noreferrer"
              target="_blank"
            >
              {isEnglish
                ? 'Global CBPR Forum membership'
                : 'Global CBPR Forumの参加国'}
            </a>
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
