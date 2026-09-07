import { featuredApp, featuredAppPaths } from './site';
import { tsutawaru, tsutawaruPaths } from './tsutawaru';
import { locationLogger, locationLoggerPaths } from './location-logger';

// Shared directory/navigation. Feature facts stay in each app's canonical docs.
export const appCatalog = [
  {
    ...featuredApp,
    paths: featuredAppPaths,
    icon: `${featuredApp.imageDirectory}/icon.png`,
    headline: {
      ja: 'ピントと露出を、撮る前に確かめる。',
      en: 'Check focus and exposure before the shot.',
    },
    summary: {
      ja: 'ピントを置く距離と絞りから、合って見える範囲を確かめるiPhoneアプリ。',
      en: 'See how far acceptable focus extends from a chosen distance and aperture on iPhone.',
    },
  },
  {
    ...tsutawaru,
    paths: tsutawaruPaths,
    icon: '/images/tsutawaru-moji/icon.png',
    headline: {
      ja: '話した言葉を、大きく見やすく。',
      en: 'Spoken words, easier to read.',
    },
    summary: {
      ja: '対面の会話を、iPhoneの大きな文字で読みやすく。',
      en: 'Read face-to-face conversations as large text on iPhone.',
    },
  },
  {
    ...locationLogger,
    paths: locationLoggerPaths,
    icon: null,
    headline: {
      ja: '通った道を、地図で見返す。',
      en: 'Look back at the places you went.',
    },
    summary: {
      ja: 'iPhoneとApple Watchで受け取った位置を端末に記録し、地図で見返せます。',
      en: 'Keep locations delivered to iPhone and Apple Watch on your devices, and revisit them on a map.',
    },
  },
] as const;
export type CatalogApp = (typeof appCatalog)[number];
export type AppPageKind = 'app' | 'support' | 'privacy' | 'feedback';
export const appPageLabels = {
  ja: {
    app: '紹介',
    support: 'サポート',
    privacy: 'プライバシー',
    feedback: 'フィードバック',
  },
  en: {
    app: 'Overview',
    support: 'Support',
    privacy: 'Privacy',
    feedback: 'Feedback',
  },
} as const;
