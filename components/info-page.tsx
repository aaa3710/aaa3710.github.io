import { ArrowLeft } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import { localePath, type Locale } from '@/lib/site';

type InfoKind = 'privacy' | 'support';

const info = {
  ja: {
    privacy: {
      label: 'Focus Mapのプライバシー',
      title: 'アプリがデータを勝手に送ることはありません。',
      intro:
        'Focus Mapは、個人情報、位置情報、写真、連絡先、識別子、利用状況、診断情報を収集しません。',
      sections: [
        [
          'アプリからの通信',
          'アカウント、広告、解析SDK、追跡はありません。計算値や設定を外部サーバーへ自動送信しません。利用者がフィードバックを選んだ場合だけ、外部Webページを開きます。',
        ],
        [
          'iPhone内に保存する設定',
          '表示言語、撮影機材、レンズ・センサー・解像度・絞り・距離・許容錯乱円・グラフ表示、実寸表示の校正値を、このiPhone内のアプリ設定として保存します。端末外へ送信せず、第三者へ販売・共有しません。',
        ],
        [
          '削除',
          '機材や表示プリセットはアプリ内で削除できます。アプリを削除すると、Focus Mapが端末内に保存した設定も削除されます。',
        ],
        [
          '自分でフィードバックを送る場合',
          'フィードバックページはGoogleフォームを使用し、メールアドレスを収集しません。自由記述欄に入力した本文はGoogleのサービスを通じて送信・保存され、開発者が確認します。今後、必要に応じて安全に分離した環境でAIによる整理を行う場合があります。Focus Map本体が計算値や設定を添付することはありません。',
        ],
        [
          '変更と問い合わせ',
          '機能やデータの扱いを変更した場合は、この文面とApp Store上の情報を更新します。監視可能な問い合わせ窓口は、App Store公開前にこのページへ追加します。',
        ],
      ],
      date: '適用予定日: 初回リリース日',
    },
    support: {
      label: 'Focus Mapのサポート',
      title: '計算結果の見方と、できないこと。',
      intro:
        'Focus Mapの数値は、撮影前の判断を助けるための目安です。結果に影響する前提と、現在の計算に含まれないものをまとめています。',
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
          '試し撮り、カメラの表示、露出計でも確認してください。Focus Mapの計算だけに頼らないでください。',
        ],
      ],
    },
  },
  en: {
    privacy: {
      label: 'Focus Map privacy',
      title: 'The app does not send your data anywhere automatically.',
      intro:
        'Focus Map does not collect personal information, location, photos, contacts, identifiers, usage data, or diagnostics.',
      sections: [
        [
          'Communication from the app',
          'There is no account system, advertising, analytics SDK, or tracking. Focus Map never transmits calculations or settings to an external server automatically. It opens an external web page only when the user chooses to send feedback.',
        ],
        [
          'Settings stored on your iPhone',
          'Language choice, equipment, lens, sensor, resolution, aperture, distance, circle-of-confusion and graph settings, and physical-display calibration are stored locally in the app settings on this iPhone. They are not transmitted off the device, sold, or shared with third parties.',
        ],
        [
          'Deletion',
          'Equipment and display presets can be deleted inside the app. Deleting Focus Map also deletes the settings the app stored locally.',
        ],
        [
          'When you choose to send feedback',
          'The feedback page uses Google Forms and does not collect email addresses. Text entered in the free-text field is sent and stored through Google’s service and reviewed by the developer. In the future, it may be organized with AI in an isolated environment when helpful. Focus Map does not attach calculation values or settings.',
        ],
        [
          'Changes and questions',
          'If features or data practices change, this policy and the App Store disclosure will be updated. A monitored contact method will be added here before the App Store release.',
        ],
      ],
      date: 'Effective date: initial release date',
    },
    support: {
      label: 'Focus Map support',
      title: 'How to read the results, and what they do not cover.',
      intro:
        'Focus Map results are guides for decisions before a photograph. This page summarizes the assumptions that affect the numbers and what is outside the current model.',
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
