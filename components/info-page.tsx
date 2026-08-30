import { ArrowLeft, CheckCircle2, MessageSquareText } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import { localePath, type Locale } from '@/lib/site';

type InfoKind = 'privacy' | 'support';

const info = {
  ja: {
    privacy: {
      label: 'Focus Map · プライバシーポリシー',
      title: '収集しない。送信しない。',
      intro:
        'Focus Mapは、個人情報、位置情報、写真、連絡先、識別子、利用状況、診断情報を収集しません。',
      sections: [
        [
          '外部との通信',
          'アカウント、広告、解析SDK、追跡はありません。計算値や設定を外部サーバーへ自動送信しません。利用者がフィードバックを選んだ場合だけ、外部Webページを開きます。',
        ],
        [
          '端末内に保存するもの',
          '表示言語、撮影機材、レンズ・センサー・解像度・絞り・距離・許容錯乱円・グラフ表示、実寸表示の校正値を、このiPhone内のアプリ設定として保存します。端末外へ送信せず、第三者へ販売・共有しません。',
        ],
        [
          '削除',
          '機材や表示プリセットはアプリ内で削除できます。アプリを削除すると、Focus Mapが端末内に保存した設定も削除されます。',
        ],
        [
          '任意のフィードバック',
          'フィードバックページはGoogleフォームを使用し、メールアドレスを収集しません。送信した本文と任意で入力した端末情報はフォームの管理用保存先に保管され、隔離とAIによる整理を経て開発者が確認します。Focus Map本体が計算値や設定を添付することはありません。',
        ],
        [
          '変更と問い合わせ',
          '機能やデータの扱いを変更した場合は、この文面とApp Store上の情報を更新します。監視可能な問い合わせ窓口は、App Store公開前にこのページへ追加します。',
        ],
      ],
      date: '適用予定日: 初回リリース日',
    },
    support: {
      label: 'Focus Map · サポート',
      title: '計算の前提を含めて、確認できます。',
      intro:
        '不具合、使いにくさ、機能の提案、計算結果への質問は、個人情報を含めず専用フォームから送れます。',
      feedback: 'Focus Mapのフィードバックを送る',
      checklist: [
        'iPhoneの機種とiOSバージョン',
        'Focus Mapのバージョン',
        '使用した機材・レンズ・撮像面・入力値',
        '期待した結果と実際の結果',
        '再現手順。個人情報が写らない場合に限りスクリーンショット',
      ],
      sections: [
        [
          '被写界深度',
          '薄レンズかつ撮像面とレンズ面が平行という近似に基づく補助です。回折、収差、手ぶれ、被写体ぶれ、画像処理などは扱いません。',
        ],
        [
          '露出',
          'APEXの代数関係に基づく補助です。実際のカメラや露出計との一致を保証しません。',
        ],
        [
          '蛇腹伸長',
          '露出倍率・補正段数・実効F値だけを扱います。ティルト／スイング時の近点・遠点は扱いません。',
        ],
        [
          '重要な撮影',
          '実写、機材表示、露出計でも確認してください。Focus Mapの計算だけに依存しないでください。',
        ],
      ],
    },
  },
  en: {
    privacy: {
      label: 'Focus Map · Privacy Policy',
      title: 'Not collected. Not transmitted.',
      intro:
        'Focus Map does not collect personal information, location, photos, contacts, identifiers, usage data, or diagnostics.',
      sections: [
        [
          'External communication',
          'There is no account system, advertising, analytics SDK, or tracking. Focus Map never transmits calculations or settings to an external server automatically. It opens an external web page only when the user chooses to send feedback.',
        ],
        [
          'Information stored on the device',
          'Language choice, equipment, lens, sensor, resolution, aperture, distance, circle-of-confusion and graph settings, and physical-display calibration are stored locally in the app settings on this iPhone. They are not transmitted off the device, sold, or shared with third parties.',
        ],
        [
          'Deletion',
          'Equipment and display presets can be deleted inside the app. Deleting Focus Map also deletes the settings the app stored locally.',
        ],
        [
          'Optional feedback',
          'The feedback page uses Google Forms and does not collect email addresses. Submitted text and optional device information are stored in the form’s restricted administrative storage, isolated, organized by AI, and reviewed by the developer. Focus Map does not attach calculations or settings.',
        ],
        [
          'Changes and questions',
          'If features or data practices change, this policy and the App Store disclosure will be updated. A monitored contact method will be added here before the App Store release.',
        ],
      ],
      date: 'Effective date: initial release date',
    },
    support: {
      label: 'Focus Map · Support',
      title: 'Check the calculation assumptions as well as the result.',
      intro:
        'Use the dedicated form to report a bug, usability problem, feature idea, or calculation question without including personal data.',
      feedback: 'Send Focus Map feedback',
      checklist: [
        'iPhone model and iOS version',
        'Focus Map version',
        'equipment, lens, image area, and input values used',
        'expected and actual result',
        'reproduction steps, plus a screenshot only when it contains no personal information',
      ],
      sections: [
        [
          'Depth of field',
          'Results are aids based on a thin-lens approximation with parallel lens and image planes. Diffraction, aberrations, camera shake, subject motion, and image processing are outside the model.',
        ],
        [
          'Exposure',
          'Results use the APEX algebraic relation and are not guaranteed to match a particular camera or light meter.',
        ],
        [
          'Bellows extension',
          'The tool covers exposure factor, stop compensation, and effective f-number only. It does not calculate near and far limits with tilt or swing.',
        ],
        [
          'Important photographs',
          'Also verify with a test image, equipment display, and light meter. Do not rely on the Focus Map calculation alone.',
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
          isEnglish ? `/${kind}/focus-map/` : `/en/${kind}/focus-map/`
        }
      />
      <article className="info-page section">
        <a className="back-link" href={localePath(locale, '/apps/focus-map/')}>
          <ArrowLeft aria-hidden="true" size={16} />
          Focus Map
        </a>
        <p className="section-label">{page.label}</p>
        <h1>{page.title}</h1>
        <p className="info-intro">{page.intro}</p>

        {'checklist' in page ? (
          <>
            <a
              className="support-feedback-action"
              href={localePath(locale, '/feedback/focus-map/')}
            >
              <MessageSquareText aria-hidden="true" size={18} />
              {page.feedback}
            </a>
            <ul className="support-checklist">
              {page.checklist.map((item) => (
                <li key={item}>
                  <CheckCircle2 aria-hidden="true" size={18} />
                  {item}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <div className="info-sections">
          {page.sections.map(([title, body]) => (
            <section key={title}>
              <h2>{title}</h2>
              <p>{body}</p>
            </section>
          ))}
        </div>

        {'date' in page ? <p className="policy-date">{page.date}</p> : null}
      </article>
      <SiteFooter locale={locale} />
    </main>
  );
}
