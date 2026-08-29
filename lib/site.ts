export type Locale = 'ja' | 'en';

export const appPlaceholders = [
  { slug: 'location-logger', name: 'LocationLogger' },
  { slug: 'card-relay', name: 'CardRelay' },
  { slug: 'wrist-morse', name: 'WristMorse' },
  { slug: 'tsutawaru-moji', name: 'TsutawaruMoji' },
  { slug: 'genome-notebook', name: 'GenomeNotebook' },
  { slug: 'spatial-fold', name: 'SpatialFold' },
  { slug: 'task-rail', name: 'TaskRail' },
  { slug: 'mastery-steps', name: 'MasterySteps' },
] as const;

export const siteBasePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(
  /\/$/,
  '',
);

export function sitePath(path: string) {
  if (path.startsWith('#') || /^(?:https?:|mailto:)/.test(path)) {
    return path;
  }

  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  const normalized =
    withLeadingSlash.length > 1
      ? withLeadingSlash.replace(/\/$/, '')
      : withLeadingSlash;
  return `${siteBasePath}${normalized}`;
}

export function localePath(locale: Locale, path = '/') {
  const normalized =
    path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return sitePath(
    locale === 'en' ? `/en${normalized || '/'}` : normalized || '/',
  );
}

export const siteOrigin = (
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? 'http://localhost:3000'
).replace(/\/$/, '');

export const canonicalBaseUrl = `${siteOrigin}${siteBasePath}`;

export function absoluteSiteUrl(path = '/') {
  const normalized =
    path === '/' ? '/' : path.startsWith('/') ? path : `/${path}`;
  return `${canonicalBaseUrl}${normalized}`;
}
