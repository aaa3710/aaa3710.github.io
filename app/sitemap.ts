import { localizedAppRoute } from '@/lib/app-routes';
import type { MetadataRoute } from 'next';
import { absoluteSiteUrl, featuredAppPaths } from '@/lib/site';
import { tsutawaruPaths } from '@/lib/tsutawaru';
import { locationLoggerPaths } from '@/lib/location-logger';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-09-04T00:00:00+09:00');

  return [
    ...(['ja', 'en'] as const).flatMap((locale) =>
      (['app', 'support', 'privacy'] as const).map((kind) => ({
        url: absoluteSiteUrl(
          localizedAppRoute(locale, locationLoggerPaths[kind]),
        ),
        lastModified: new Date('2026-09-05T00:00:00+09:00'),
        priority: kind === 'app' ? 0.7 : 0.4,
      })),
    ),
    ...(['ja', 'en'] as const).flatMap((locale) =>
      (['app', 'support', 'privacy'] as const).map((kind) => ({
        url: absoluteSiteUrl(localizedAppRoute(locale, tsutawaruPaths[kind])),
        lastModified: new Date('2026-09-05T00:00:00+09:00'),
        priority: kind === 'app' ? 0.7 : 0.4,
      })),
    ),
    {
      url: absoluteSiteUrl('/apps/'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: absoluteSiteUrl('/apps/en/'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteSiteUrl(featuredAppPaths.app),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: absoluteSiteUrl(localizedAppRoute('en', featuredAppPaths.app)),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: absoluteSiteUrl(featuredAppPaths.privacy),
      lastModified,
      priority: 0.5,
    },
    {
      url: absoluteSiteUrl(localizedAppRoute('en', featuredAppPaths.privacy)),
      lastModified,
      priority: 0.4,
    },
    {
      url: absoluteSiteUrl(featuredAppPaths.support),
      lastModified,
      priority: 0.5,
    },
    {
      url: absoluteSiteUrl(localizedAppRoute('en', featuredAppPaths.support)),
      lastModified,
      priority: 0.4,
    },
    {
      url: absoluteSiteUrl('/apps/contact/'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: absoluteSiteUrl('/apps/en/contact/'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
