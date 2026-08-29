import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Eye,
  LockKeyhole,
  Ruler,
  Smartphone,
} from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import { localePath, sitePath, type Locale } from '@/lib/site';

const content = {
  ja: {
    back: 'アプリ一覧へ',
    eyebrow: 'iPhone · iOS 17以降 · 公開準備中',
    title: '撮影前の「どこまで合う？」を、短く確かめる。',
    lead: 'Focus Mapは、被写界深度と露出の計算結果を、撮影中に読み取りやすい形へ変えるiPhoneアプリです。無料公開を予定しています。',
    state: 'App Store公開準備中',
    privacy: 'プライバシーを見る',
    support: '計算の前提とサポート',
    sceneLabel: 'こんな判断に',
    sceneTitle: '数字を調べる時間を、構図を考える時間へ。',
    scenes: [
      ['スナップで', '2m・F8なら、手前のどこから奥のどこまでを許容できるか。'],
      [
        '絞りを比べて',
        'F値を変えたとき、許容範囲と境界外のボケがどう変わるか。',
      ],
      [
        '機材を見比べて',
        '異なるセンサー形式を、同じ縮尺や実寸で見るとどれほど違うか。',
      ],
    ],
    focusLabel: 'Focus mode',
    focusTitle: '範囲と、その外側を同じ画面で。',
    focusBody:
      '機材、ピント位置、F値、許容錯乱円から近点・遠点を計算します。許容範囲は大きな数値で先に示し、被写体距離に応じたボケ量は連続曲線で確認できます。F値比較と距離比較にも切り替えられます。',
    sensorLabel: 'Sensor guide',
    sensorTitle: '実寸でも、比率でも。',
    sensorBody:
      '代表的な撮像面を、中判44×33まで同じ縮尺で比較できます。対応端末では画面を校正し、実寸表示も利用できます。選択した形式を1として、幅・高さ・対角長・面積の比を確認できます。',
    exposureLabel: 'Exposure & bellows',
    exposureTitle: 'APEXの関係を、4行のまま扱う。',
    exposureBody:
      '露出モードはAv・Tv・Bv・Svを固定した4行で示し、選んだ1値を残り3値から計算します。別画面では、焦点距離と蛇腹伸長から露出倍率、補正段数、実効F値を求められます。',
    noShot:
      'APEX画面は直近の再設計に合わせてApp Store用画像を更新中です。古い画面を完成版として掲載していません。',
    localLabel: 'Data & privacy',
    localTitle: '計算は、iPhoneの中だけで。',
    localBody:
      'アカウント、広告、解析SDK、追跡、外部サーバーへの通信はありません。機材や表示の設定は端末内に保存され、外部へ送信されません。',
    facts: [
      'アカウント不要',
      '外部通信なし',
      '広告・解析・追跡なし',
      '日本語・英語を切替可能',
    ],
    evidenceLabel: '現在確認できていること',
    evidenceTitle: '完成度を、公開済みのようには見せません。',
    evidenceBody:
      '2026年8月27日時点で、単体テスト112件、日英UI回帰テスト2件、解析、未署名Releaseビルドを通過しています。これは実機での触覚、片手操作、VoiceOverの実読み上げ、TestFlightやApp Store配布の確認とは別です。',
    limitsLabel: '計算の前提',
    limitsTitle: '撮影結果そのものを保証するアプリではありません。',
    limitsBody:
      '被写界深度は薄レンズかつ撮像面とレンズ面が平行という近似、露出はAPEXの代数関係に基づく補助です。回折、収差、手ぶれ、被写体ぶれ、画像処理、個々のレンズや測光の差までは扱いません。重要な撮影では、実写、機材表示、露出計でも確認してください。',
    closeTitle: '公開されたら、ここからApp Storeへ。',
    closeBody: '公開前は、確定した機能と制約だけをこのページへ反映します。',
  },
  en: {
    back: 'Back to all apps',
    eyebrow: 'iPhone · iOS 17 or later · Preparing for release',
    title: 'Answer “how much stays acceptable?” before the shot.',
    lead: 'Focus Map turns depth-of-field and exposure calculations into an iPhone interface made to read while shooting. It is planned as a free release.',
    state: 'Preparing for the App Store',
    privacy: 'Read the privacy policy',
    support: 'Assumptions and support',
    sceneLabel: 'Questions it helps answer',
    sceneTitle:
      'Spend less time looking up numbers and more time on the frame.',
    scenes: [
      [
        'For a quick street shot',
        'At 2 m and f/8, where does the acceptable range begin and end?',
      ],
      [
        'When comparing apertures',
        'How do the range and the blur beyond it change with the f-number?',
      ],
      [
        'When comparing equipment',
        'How different do sensor formats look at one scale or at physical size?',
      ],
    ],
    focusLabel: 'Focus mode',
    focusTitle: 'The range and what happens outside it, together.',
    focusBody:
      'Focus Map calculates near and far limits from equipment, focus distance, f-number, and circle of confusion. It leads with the acceptable range, then uses a continuous curve to show blur at other subject distances. Aperture and focus-distance comparisons are available from the same mode.',
    sensorLabel: 'Sensor guide',
    sensorTitle: 'At physical size or by ratio.',
    sensorBody:
      'Compare representative image formats through 44×33 medium format at one scale. On supported devices, calibrate the display for physical-size viewing. Any selected format can become the baseline for width, height, diagonal, and area ratios.',
    exposureLabel: 'Exposure & bellows',
    exposureTitle: 'Keep the four APEX values in four stable rows.',
    exposureBody:
      'Exposure mode shows Av, Tv, Bv, and Sv in four fixed rows and solves the selected value from the other three. A separate tool calculates bellows exposure factor, stop compensation, and effective f-number from focal length and extension.',
    noShot:
      'The App Store image for APEX is being refreshed after a recent interface revision, so an older screen is not presented here as the finished version.',
    localLabel: 'Data & privacy',
    localTitle: 'The calculations stay on the iPhone.',
    localBody:
      'There are no accounts, ads, analytics SDKs, tracking, or external server connections. Equipment and display settings are stored locally and are not transmitted off the device.',
    facts: [
      'No account',
      'No network connection',
      'No ads, analytics, or tracking',
      'Japanese and English in the app',
    ],
    evidenceLabel: 'Current evidence',
    evidenceTitle:
      'Release readiness is not presented as App Store availability.',
    evidenceBody:
      'As of August 27, 2026, 112 unit tests, two Japanese/English UI regression tests, analysis, and an unsigned Release build had passed. These do not replace physical-device checks for haptics, one-handed use, actual VoiceOver reading, TestFlight, or App Store distribution.',
    limitsLabel: 'Calculation assumptions',
    limitsTitle: 'The app does not guarantee a final photograph.',
    limitsBody:
      'Depth-of-field results are aids based on a thin-lens approximation with parallel lens and image planes. Exposure uses APEX algebra. Diffraction, aberrations, camera shake, subject motion, image processing, and the behaviour of a particular lens or meter are outside the model. For an important photograph, also verify with a test image, equipment display, and light meter.',
    closeTitle: 'When released, this page will lead to the App Store.',
    closeBody:
      'Until then, only confirmed features and limits are published here.',
  },
} as const;

export function FocusMapDetail({ locale }: { locale: Locale }) {
  const text = content[locale];
  const isEnglish = locale === 'en';
  const mainScreen = isEnglish ? 'main-en.png' : 'main-ja.png';
  const sensorScreen = isEnglish ? 'sensors-en.png' : 'sensors-ja.png';

  return (
    <main id="top" lang={locale}>
      <SiteHeader
        locale={locale}
        languageHref={isEnglish ? '/apps/focus-map/' : '/en/apps/focus-map/'}
      />

      <section className="detail-hero section">
        <div className="detail-hero-copy">
          <a className="back-link" href={localePath(locale)}>
            <ArrowLeft aria-hidden="true" size={16} />
            {text.back}
          </a>
          <div className="detail-identity">
            <img
              src={sitePath('/images/focus-map/icon.png')}
              alt="Focus Map"
              width="92"
              height="92"
            />
            <div>
              <p>{text.eyebrow}</p>
              <strong>Focus Map</strong>
            </div>
          </div>
          <h1>{text.title}</h1>
          <p className="detail-lead">{text.lead}</p>
          <div className="detail-actions">
            <span className="disabled-store-action" aria-disabled="true">
              {text.state}
            </span>
            <a href={localePath(locale, '/privacy/focus-map/')}>
              {text.privacy}
            </a>
            <a href={localePath(locale, '/support/focus-map/')}>
              {text.support}
            </a>
          </div>
        </div>
        <div className="detail-phone phone-frame">
          <div className="phone-speaker" aria-hidden="true" />
          <img
            src={sitePath(`/images/focus-map/${mainScreen}`)}
            alt={
              isEnglish
                ? 'Focus Map focus calculation screen'
                : 'Focus Mapの被写界深度計算画面'
            }
            width="1320"
            height="2868"
          />
        </div>
      </section>

      <section
        className="decision-section section"
        aria-labelledby="decision-title"
      >
        <p className="section-label">{text.sceneLabel}</p>
        <h2 id="decision-title">{text.sceneTitle}</h2>
        <div className="decision-grid">
          {text.scenes.map(([title, body], index) => (
            <article key={title}>
              {index === 0 ? (
                <Eye aria-hidden="true" />
              ) : index === 1 ? (
                <Calculator aria-hidden="true" />
              ) : (
                <Ruler aria-hidden="true" />
              )}
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="feature-story section feature-story-main">
        <div className="feature-screen">
          <img
            src={sitePath(`/images/focus-map/${mainScreen}`)}
            alt={
              isEnglish
                ? 'Continuous blur curve and acceptable focus range'
                : '連続的なボケ量の曲線と許容距離帯'
            }
            width="1320"
            height="2868"
          />
        </div>
        <div className="feature-copy">
          <p className="section-label">{text.focusLabel}</p>
          <h2>{text.focusTitle}</h2>
          <p>{text.focusBody}</p>
        </div>
      </section>

      <section className="feature-story section feature-story-reverse">
        <div className="feature-screen feature-screen-soft">
          <img
            src={sitePath(`/images/focus-map/${sensorScreen}`)}
            alt={
              isEnglish
                ? 'Sensor format comparison at one scale'
                : '撮像面を同じ縮尺で比較する画面'
            }
            width="1320"
            height="2868"
          />
        </div>
        <div className="feature-copy">
          <p className="section-label">{text.sensorLabel}</p>
          <h2>{text.sensorTitle}</h2>
          <p>{text.sensorBody}</p>
        </div>
      </section>

      <section className="exposure-section section">
        <div>
          <p className="section-label">{text.exposureLabel}</p>
          <h2>{text.exposureTitle}</h2>
          <p>{text.exposureBody}</p>
        </div>
        <aside>
          <Calculator aria-hidden="true" />
          <p>{text.noShot}</p>
        </aside>
      </section>

      <section className="privacy-feature section">
        <div className="privacy-symbol" aria-hidden="true">
          <LockKeyhole />
        </div>
        <div>
          <p className="section-label">{text.localLabel}</p>
          <h2>{text.localTitle}</h2>
          <p>{text.localBody}</p>
          <ul>
            {text.facts.map((fact) => (
              <li key={fact}>
                <CheckCircle2 aria-hidden="true" size={18} />
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="evidence-section section">
        <div>
          <p className="section-label">{text.evidenceLabel}</p>
          <h2>{text.evidenceTitle}</h2>
        </div>
        <p>{text.evidenceBody}</p>
      </section>

      <section className="limits-section section">
        <Smartphone aria-hidden="true" />
        <div>
          <p className="section-label">{text.limitsLabel}</p>
          <h2>{text.limitsTitle}</h2>
          <p>{text.limitsBody}</p>
        </div>
      </section>

      <section className="closing-cta section">
        <p>Focus Map</p>
        <h2>{text.closeTitle}</h2>
        <span>{text.closeBody}</span>
        <a href={localePath(locale)}>
          {text.back}
          <ArrowRight aria-hidden="true" size={16} />
        </a>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
