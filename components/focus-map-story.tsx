import { localizedAppRoute } from '@/lib/app-routes';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Camera,
  CheckCircle2,
  Eye,
  LockKeyhole,
  Ruler,
  Smartphone,
} from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import {
  featuredApp,
  featuredAppPaths,
  localePath,
  sitePath,
  type Locale,
} from '@/lib/site';

// Preserve the existing real captures, but do not display them under a new
// app name until replacement captures have been independently verified.
const hasCurrentScreenshots = false;

const content = {
  ja: {
    back: 'アプリ一覧へ',
    eyebrow: 'iPhone · iOS 17以降 · 公開準備中',
    title: (
      <>
        <span className="focus-title-line">ピント合わせに</span>
        <span className="focus-title-line">迷う時間を、</span>
        <span className="focus-title-line">写真を撮る時間へ。</span>
      </>
    ),
    lead: 'ピントを置く距離と絞りから、どの範囲まで合って見えるかを確かめるiPhoneアプリです。マニュアルフォーカスのカメラやレンズで、撮影前の計算を手早く済ませたいときに使えます。',
    state: 'App Store公開準備中',
    privacy: 'プライバシー',
    support: 'サポート',
    screenNote: '実際のアプリ画面（シミュレーター）',
    originLabel: 'このアプリを作った理由',
    originTitle: '計算を終えて、写真に集中したかった。',
    originBody:
      'ピント位置と絞りを先に決めておけば、撮影中に考えることを減らせます。ただ、そのたびに被写界深度を手計算するのは面倒でした。そこで、iPhoneですぐに範囲を確認できる、自分でも使いたい道具として「撮影のものさし」を作り始めました。',
    sceneLabel: 'こんなときに',
    sceneTitle: '計算結果を見ながら、機材ごとの距離感をつかむ。',
    scenes: [
      [
        'スナップの前に',
        'ピント位置と絞りを先に決め、手前から奥までどこが合って見えるか確認する。',
      ],
      [
        '新しい機材に慣れるとき',
        'まだ感覚が身についていなくても、計算結果を見ながら機材ごとの距離感を覚える。',
      ],
      [
        '仕組みまで楽しみたいとき',
        '写真を撮るだけでなく、光学や露出の考え方も必要なところから学ぶ。',
      ],
    ],
    focusLabel: 'ピントの範囲',
    focusTitle: '距離と絞りを選ぶと、合って見える範囲が分かります。',
    focusBody:
      '手前と奥の境界を大きく表示します。この範囲は「被写界深度」と呼ばれます。境界の外では、ぼけがどのように増えるかを曲線で確認でき、絞りやピント位置を変えた場合も比べられます。',
    sensorLabel: 'センサーサイズ',
    sensorTitle: '大きさの違いを、図で比べる。',
    sensorBody:
      'スマートフォンから中判まで、代表的なセンサーの大きさを同じ縮尺で並べます。対応端末では実寸表示も利用でき、幅、高さ、対角線、面積の違いも比べられます。',
    learningLabel: 'さらに詳しく',
    learningTitle: '絞り・シャッター速度・ISOの関係も確かめられます。',
    learningBody:
      '写真の明るさを考えるためのAPEXという仕組みを、一般的なカメラの値と並べて確認できます。大判カメラや接写で必要になる、蛇腹の長さによる露出補正も別の画面で計算できます。',
    learningAside:
      'ふだんの撮影に必要な結果は短く表示し、専門的な計算と解説は別の画面に分けています。',
    localLabel: 'プライバシー',
    localTitle: '計算や設定を、勝手に外へ送りません。',
    localBody:
      'アカウント、広告、利用状況の解析、追跡はありません。計算値と設定はiPhone内に保存されます。自分でフィードバックを開いた場合だけ、外部の入力ページへ移動します。',
    facts: [
      'アカウント不要',
      '計算・設定の自動送信なし',
      '広告・解析・追跡なし',
      '日本語・英語に対応',
    ],
    releaseLabel: '公開状況',
    releaseTitle: '現在は、App Storeでの公開に向けて確認中です。',
    releaseBody:
      '画面と計算の自動テスト、ビルドの確認は進んでいます。実機での操作やVoiceOverなど、実際の端末で確認する項目は別に残しており、App Storeで公開済みのようには表示しません。',
    limitsLabel: '計算結果について',
    limitsTitle: '撮影前の目安としてお使いください。',
    limitsBody:
      '実際の写りは、レンズの特性、回折、手ぶれ、被写体の動き、カメラ内の画像処理などでも変わります。大切な撮影では、試し撮りやカメラの表示、露出計でも確認してください。',
    closeTitle: '公開後は、ここからApp Storeへ。',
    closeBody: 'それまでは、現在のアプリで確認できる内容だけをご案内します。',
  },
  en: {
    back: 'Back to all apps',
    eyebrow: 'iPhone · iOS 17 or later · Preparing for release',
    title:
      'Spend less time calculating focus and more time taking photographs.',
    lead: 'Choose a focus distance and aperture to see how much of the scene should appear acceptably sharp. Photo Yardstick is designed for quick checks before shooting with manual-focus cameras and lenses.',
    state: 'Preparing for the App Store',
    privacy: 'Privacy',
    support: 'Support',
    screenNote: 'Actual app screen (Simulator)',
    originLabel: 'Why I made it',
    originTitle:
      'I wanted to finish the calculation and return to the photograph.',
    originBody:
      'Setting focus and aperture in advance can remove decisions while shooting, but calculating depth of field each time was slow. I began Photo Yardstick as a tool I wanted for myself: a quick way to check the range on an iPhone.',
    sceneLabel: 'Useful moments',
    sceneTitle: 'Build a feel for focus distance with each camera and lens.',
    scenes: [
      [
        'Before a quick street shot',
        'Set focus and aperture in advance, then check how far the acceptably sharp area extends.',
      ],
      [
        'While learning new equipment',
        'Use the calculation as a reference while developing a feel for a new camera or lens.',
      ],
      [
        'When the science is part of the fun',
        'Explore the optics and exposure ideas behind a photograph only when you want to go deeper.',
      ],
    ],
    focusLabel: 'Focus range',
    focusTitle: 'Choose a distance and aperture to see the acceptable range.',
    focusBody:
      'The near and far limits are shown first. This range is called depth of field. A curve then shows how blur grows beyond those limits, and comparison views show what changes with a different aperture or focus distance.',
    sensorLabel: 'Sensor sizes',
    sensorTitle: 'Compare the difference as a picture, not only as numbers.',
    sensorBody:
      'Representative formats from smartphones through medium format are drawn at one scale. Supported devices can also show physical size, with width, height, diagonal, and area comparisons.',
    learningLabel: 'Go deeper',
    learningTitle: 'Explore how aperture, shutter speed, and ISO relate.',
    learningBody:
      'A deeper screen pairs familiar camera settings with the APEX system for exposure. A separate tool calculates the exposure change caused by bellows extension in large-format and close-up photography.',
    learningAside:
      'The main result stays short. Specialist calculations and explanations live on separate screens.',
    localLabel: 'Privacy',
    localTitle:
      'Calculations and settings are not sent anywhere automatically.',
    localBody:
      'There are no accounts, ads, usage analytics, or tracking. Calculations and settings stay on the iPhone. An external page opens only when you choose to send feedback.',
    facts: [
      'No account',
      'No automatic transmission of calculations or settings',
      'No ads, analytics, or tracking',
      'Japanese and English',
    ],
    releaseLabel: 'Release status',
    releaseTitle: 'Photo Yardstick is still being prepared for the App Store.',
    releaseBody:
      'Automated calculation and interface tests and build checks are in progress. Physical-device checks, including hands-on use and VoiceOver, remain separate, so this page does not present the app as already released.',
    limitsLabel: 'About the results',
    limitsTitle: 'Use the calculation as a guide before the shot.',
    limitsBody:
      'The final image also depends on lens behaviour, diffraction, camera shake, subject movement, and in-camera processing. For an important photograph, also check a test image, the camera display, and a light meter.',
    closeTitle: 'After release, this page will link to the App Store.',
    closeBody:
      'Until then, it describes only what can be confirmed in the current app.',
  },
} as const;

export function FocusMapStory({ locale }: { locale: Locale }) {
  const text = content[locale];
  const isEnglish = locale === 'en';
  const mainScreen = isEnglish ? 'main-en.png' : 'main-ja.png';
  const sensorScreen = isEnglish ? 'sensors-en.png' : 'sensors-ja.png';

  return (
    <main id="top" lang={locale}>
      <SiteHeader
        locale={locale}
        languageHref={
          isEnglish
            ? featuredAppPaths.app
            : localizedAppRoute('en', featuredAppPaths.app)
        }
      />

      <section
        className={`detail-hero section${hasCurrentScreenshots ? '' : ' without-app-screen'}`}
      >
        <div className="detail-hero-copy">
          <a className="back-link" href={localePath(locale, '/apps/#apps')}>
            <ArrowLeft aria-hidden="true" size={16} />
            {text.back}
          </a>
          <div className="detail-identity">
            <img
              src={sitePath(`${featuredApp.imageDirectory}/icon.png`)}
              alt={featuredApp.name[locale]}
              width="92"
              height="92"
            />
            <div>
              <p>{text.eyebrow}</p>
              <strong>{featuredApp.name[locale]}</strong>
              <p>{featuredApp.subtitle[locale]}</p>
            </div>
          </div>
          <h1>{text.title}</h1>
          <p className="detail-lead">{text.lead}</p>
          <div className="detail-actions">
            <span className="disabled-store-action" aria-disabled="true">
              {text.state}
            </span>
            <a href={localePath(locale, featuredAppPaths.privacy)}>
              {text.privacy}
            </a>
            <a href={localePath(locale, featuredAppPaths.support)}>
              {text.support}
            </a>
          </div>
        </div>
        {hasCurrentScreenshots ? (
          <div className="detail-visual">
            <div className="detail-phone phone-frame">
              <div className="phone-speaker" aria-hidden="true" />
              <img
                src={sitePath(`${featuredApp.imageDirectory}/${mainScreen}`)}
                alt={
                  isEnglish
                    ? 'Photo Yardstick showing an acceptable focus range and blur curve'
                    : '「撮影のものさし」で、合って見える範囲とぼけの曲線を表示している画面'
                }
                width="1320"
                height="2868"
              />
            </div>
            <p className="evidence-note">{text.screenNote}</p>
          </div>
        ) : null}
      </section>

      <section className="origin-section section">
        <div>
          <p className="section-label">{text.originLabel}</p>
          <h2>{text.originTitle}</h2>
        </div>
        <p>{text.originBody}</p>
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
                <Camera aria-hidden="true" />
              ) : index === 1 ? (
                <Eye aria-hidden="true" />
              ) : (
                <BookOpen aria-hidden="true" />
              )}
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className={`feature-story section feature-story-main${hasCurrentScreenshots ? '' : ' without-app-screen'}`}
      >
        {hasCurrentScreenshots ? (
          <div className="feature-screen">
            <img
              src={sitePath(`${featuredApp.imageDirectory}/${mainScreen}`)}
              alt={
                isEnglish
                  ? 'Focus range and continuous blur curve'
                  : 'ピントが合って見える範囲と、ぼけの変化を示す曲線'
              }
              width="1320"
              height="2868"
            />
          </div>
        ) : null}
        <div className="feature-copy">
          <p className="section-label">{text.focusLabel}</p>
          <h2>{text.focusTitle}</h2>
          <p>{text.focusBody}</p>
        </div>
      </section>

      <section
        className={`feature-story section feature-story-reverse${hasCurrentScreenshots ? '' : ' without-app-screen'}`}
      >
        {hasCurrentScreenshots ? (
          <div className="feature-screen feature-screen-soft">
            <img
              src={sitePath(`${featuredApp.imageDirectory}/${sensorScreen}`)}
              alt={
                isEnglish
                  ? 'Sensor formats compared at one scale'
                  : 'センサーの大きさを同じ縮尺で比べる画面'
              }
              width="1320"
              height="2868"
            />
          </div>
        ) : null}
        <div className="feature-copy">
          <p className="section-label">{text.sensorLabel}</p>
          <h2>{text.sensorTitle}</h2>
          <p>{text.sensorBody}</p>
        </div>
      </section>

      <section className="learning-section section">
        <div>
          <p className="section-label">{text.learningLabel}</p>
          <h2>{text.learningTitle}</h2>
          <p>{text.learningBody}</p>
        </div>
        <aside>
          <Ruler aria-hidden="true" />
          <p>{text.learningAside}</p>
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

      <section className="release-section section">
        <div>
          <p className="section-label">{text.releaseLabel}</p>
          <h2>{text.releaseTitle}</h2>
        </div>
        <p>{text.releaseBody}</p>
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
        <p>{featuredApp.name[locale]}</p>
        <h2>{text.closeTitle}</h2>
        <span>{text.closeBody}</span>
        <a href={localePath(locale, '/apps/#apps')}>
          {text.back}
          <ArrowRight aria-hidden="true" size={16} />
        </a>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
