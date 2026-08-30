import {
  ArrowDown,
  ArrowRight,
  Check,
  Globe2,
  LockKeyhole,
  MessageSquareText,
  Sparkles,
  WifiOff,
} from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import { appPlaceholders, localePath, sitePath, type Locale } from '@/lib/site';

const copy = {
  ja: {
    eyebrow: 'iPhoneで、撮影中の判断を短く',
    title: (
      <>
        ピントの範囲を、
        <br />
        見える形に。
      </>
    ),
    lead: '距離とF値から「どこからどこまで」を大きく表示。境界の外側も、ボケ量の曲線で連続的に確かめられます。',
    action: 'Focus Mapを見る',
    state: 'App Store公開準備中',
    trust: ['無料で公開予定', '外部通信なし', 'アカウント・追跡なし'],
    actual: '実際のアプリ画面（Simulator）',
    pointsTitle: '「合っている／外れている」だけで終わらせない。',
    points: [
      [
        '許容範囲を先に',
        '近点から遠点までを、撮影中でも拾いやすい大きな数値で示します。',
      ],
      [
        '外側も連続して見る',
        '被写体距離に応じた錯乱円の変化を曲線でたどれます。',
      ],
      [
        '必要な深さだけ開く',
        '普段は短く、機材・数式・限界は必要な人だけ詳しく確認できます。',
      ],
    ],
    secondEyebrow: 'もう一つの見え方',
    secondTitle: 'センサーサイズを、数字だけにしない。',
    secondBody:
      '代表的な撮像面を同じ縮尺や実寸で比較。幅・高さ・対角長・面積の比も、選んだ形式を基準に確かめられます。',
    principleEyebrow: 'つくり方',
    principleTitle: '機能の数より、迷わず使い終えられること。',
    principles: [
      ['判断を減らす', '最初の画面には、その場で必要な結果を先に置きます。'],
      [
        '普段は浅く、必要時だけ深く',
        '設定や理屈は隠さず、作業を邪魔しない順序に分けます。',
      ],
      [
        '限界も製品の一部にする',
        '計算の前提や、保証できないことを説明の奥へ追いやりません。',
      ],
    ],
    appsEyebrow: 'すべてのアプリ',
    appsTitle: '完成したものから、一つずつ。',
    appsBody:
      'Focus Mapを最初の公開例として仕上げています。ほかのアプリは、実際に確認できる内容が固まるまで名前だけを置きます。',
    ready: '詳しいページへ',
    preparing: '準備中',
    feedbackTitle: '使って気づいたことを送る',
    feedbackBody:
      '対象アプリを選び、技術用語を使わずに書けます。投稿は隔離とAIによる整理を経て、開発者が確認します。',
    feedbackAction: 'フィードバック入力へ',
  },
  en: {
    eyebrow: 'Make focus decisions faster on iPhone',
    title: (
      <>
        See the range
        <br />
        of acceptable focus.
      </>
    ),
    lead: 'Focus Map puts the near and far limits up front, then shows how blur changes continuously beyond them.',
    action: 'Explore Focus Map',
    state: 'Preparing for the App Store',
    trust: [
      'Planned as a free app',
      'No network connection',
      'No account or tracking',
    ],
    actual: 'Actual app screen (Simulator)',
    pointsTitle: 'Go beyond a simple in-focus / out-of-focus answer.',
    points: [
      [
        'Range first',
        'Near and far limits stay large enough to read while you are preparing a shot.',
      ],
      [
        'See what happens outside',
        'A continuous curve traces how blur changes with subject distance.',
      ],
      [
        'Open only the depth you need',
        'The main path stays short; equipment, formulas, and limits remain available.',
      ],
    ],
    secondEyebrow: 'Another way to see',
    secondTitle: 'Make sensor sizes more than numbers.',
    secondBody:
      'Compare representative image formats at one scale or physical size, then use any selected format as the baseline for width, height, diagonal, and area ratios.',
    principleEyebrow: 'How these apps are made',
    principleTitle: 'Fewer decisions matter more than more features.',
    principles: [
      [
        'Reduce judgment',
        'The first screen leads with the result needed in the moment.',
      ],
      [
        'Simple first, depth when needed',
        'Settings and theory stay available without interrupting the main task.',
      ],
      [
        'Make limits part of the product',
        'Assumptions and things the calculation cannot guarantee remain visible.',
      ],
    ],
    appsEyebrow: 'All apps',
    appsTitle: 'One complete page at a time.',
    appsBody:
      'Focus Map is the first publishing example. The other apps stay as names only until their confirmed, releasable scope is ready to describe.',
    ready: 'Open the full page',
    preparing: 'In progress',
    feedbackTitle: 'Share what you noticed',
    feedbackBody:
      'Choose the app and write without technical terminology. Reports are isolated, organized by AI, and reviewed by the developer.',
    feedbackAction: 'Open feedback',
  },
} as const;

export function HomePage({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const isEnglish = locale === 'en';
  const screen = isEnglish ? 'main-en.png' : 'main-ja.png';
  const sensorScreen = isEnglish ? 'sensors-en.png' : 'sensors-ja.png';

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: isEnglish
          ? 'Does Focus Map send data off the iPhone?'
          : 'Focus Mapはデータを外部へ送信しますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: isEnglish
            ? 'Focus Map does not transmit calculations or settings. Only when a user chooses Send Feedback does it open an external web page, and only the text entered there is submitted.'
            : 'Focus Mapは計算値や設定を送信しません。「フィードバックを送る」を利用者が選んだ場合だけ外部Webページを開き、そこで入力した内容だけが送信されます。',
        },
      },
      {
        '@type': 'Question',
        name: isEnglish
          ? 'Is Focus Map already on the App Store?'
          : 'Focus MapはすでにApp Storeで公開されていますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: isEnglish
            ? 'Not yet. It is being prepared for release and is planned to be free.'
            : 'まだ公開されていません。現在リリース準備中で、無料公開を予定しています。',
        },
      },
    ],
  };

  return (
    <main id="top" lang={locale}>
      <SiteHeader locale={locale} languageHref={isEnglish ? '/' : '/en/'} />

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span aria-hidden="true" />
            {text.eyebrow}
          </div>
          <h1>{text.title}</h1>
          <p className="hero-lead">{text.lead}</p>

          <div className="hero-actions">
            <a
              className="primary-action"
              href={localePath(locale, '/apps/focus-map/')}
            >
              {text.action}
              <ArrowRight aria-hidden="true" size={17} />
            </a>
            <span className="release-state">{text.state}</span>
          </div>

          <ul
            className="trust-list"
            aria-label={isEnglish ? 'Focus Map facts' : 'Focus Mapの特徴'}
          >
            <li>
              <Check aria-hidden="true" size={16} />
              {text.trust[0]}
            </li>
            <li>
              <WifiOff aria-hidden="true" size={16} />
              {text.trust[1]}
            </li>
            <li>
              <LockKeyhole aria-hidden="true" size={16} />
              {text.trust[2]}
            </li>
          </ul>
        </div>

        <div
          className="hero-product"
          aria-label={
            isEnglish ? 'Focus Map app screen' : 'Focus Mapのアプリ画面'
          }
        >
          <div className="app-identity">
            <img
              className="app-icon"
              src={sitePath('/images/focus-map/icon.png')}
              alt="Focus Map"
              width="72"
              height="72"
            />
            <div>
              <strong>Focus Map</strong>
              <span>
                {isEnglish ? 'Depth of Field & APEX' : 'ピントと露出を見える化'}
              </span>
            </div>
          </div>

          <div className="phone-frame">
            <div className="phone-speaker" aria-hidden="true" />
            <img
              src={sitePath(`/images/focus-map/${screen}`)}
              alt={
                isEnglish
                  ? 'Focus Map showing the acceptable range and continuous blur curve at 2 metres and f/8'
                  : 'Focus Mapで、2メートル・F8の許容範囲とボケ量の曲線を表示している画面'
              }
              width="1320"
              height="2868"
            />
          </div>
          <p className="evidence-note">{text.actual}</p>
        </div>
      </section>

      <section
        className="first-proof section"
        aria-labelledby="focus-map-title"
      >
        <p className="section-label">Focus Map</p>
        <h2 id="focus-map-title">{text.pointsTitle}</h2>
        <div className="proof-points">
          {text.points.map(([title, body], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="split-feature section">
        <div className="split-copy">
          <p className="section-label">{text.secondEyebrow}</p>
          <h2>{text.secondTitle}</h2>
          <p>{text.secondBody}</p>
          <a
            className="text-action"
            href={localePath(locale, '/apps/focus-map/')}
          >
            {text.ready}
            <ArrowRight aria-hidden="true" size={16} />
          </a>
        </div>
        <div className="screen-card">
          <img
            src={sitePath(`/images/focus-map/${sensorScreen}`)}
            alt={
              isEnglish
                ? 'Focus Map sensor format comparison'
                : 'Focus Mapのセンサーサイズ比較画面'
            }
            width="1320"
            height="2868"
          />
        </div>
      </section>

      <section
        className="principles section"
        id="principles"
        aria-labelledby="principles-title"
      >
        <p className="section-label">{text.principleEyebrow}</p>
        <h2 id="principles-title">{text.principleTitle}</h2>
        <div className="principle-grid">
          {text.principles.map(([title, body], index) => (
            <article key={title}>
              {index === 0 ? (
                <Sparkles aria-hidden="true" />
              ) : index === 1 ? (
                <ArrowDown aria-hidden="true" />
              ) : (
                <Globe2 aria-hidden="true" />
              )}
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="apps-section section" aria-labelledby="apps-title">
        <div className="section-intro">
          <div>
            <p className="section-label">{text.appsEyebrow}</p>
            <h2 id="apps-title">{text.appsTitle}</h2>
          </div>
          <p>{text.appsBody}</p>
        </div>
        <div className="app-grid">
          <a
            className="app-card app-card-ready"
            href={localePath(locale, '/apps/focus-map/')}
          >
            <img
              src={sitePath('/images/focus-map/icon.png')}
              alt=""
              width="88"
              height="88"
            />
            <div>
              <span className="status-pill">{text.state}</span>
              <h3>Focus Map</h3>
              <p>
                {isEnglish ? 'Depth of Field & APEX' : 'ピントと露出を見える化'}
              </p>
            </div>
            <span className="card-link">
              {text.ready}
              <ArrowRight aria-hidden="true" size={16} />
            </span>
          </a>
          {appPlaceholders.map((app) => (
            <a
              aria-label={`${app.name} — ${text.preparing}`}
              className="app-card app-card-placeholder"
              href={localePath(locale, `/apps/${app.slug}/`)}
              key={app.slug}
            >
              <span className="placeholder-mark" aria-hidden="true" />
              <div>
                <span className="status-pill">{text.preparing}</span>
                <h3>{app.name}</h3>
              </div>
            </a>
          ))}
        </div>
        <a className="feedback-banner" href={localePath(locale, '/feedback/')}>
          <MessageSquareText aria-hidden="true" />
          <span>
            <strong>{text.feedbackTitle}</strong>
            <small>{text.feedbackBody}</small>
          </span>
          <span className="feedback-banner-action">
            {text.feedbackAction}
            <ArrowRight aria-hidden="true" size={16} />
          </span>
        </a>
      </section>

      <SiteFooter locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </main>
  );
}
