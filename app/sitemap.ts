import type { MetadataRoute } from 'next';
import { localizedAppRoute } from '@/lib/app-routes';
import { appCatalog } from '@/lib/app-catalog';
import { absoluteSiteUrl } from '@/lib/site';
export default function sitemap(): MetadataRoute.Sitemap {
  return (['ja', 'en'] as const).flatMap((locale) => [
    ...['/apps/', '/apps/contact/'].map((path) => ({
      url: absoluteSiteUrl(localizedAppRoute(locale, path)),
      priority: path === '/apps/' ? 1 : 0.5,
    })),
    ...appCatalog.flatMap((app) =>
      (['app', 'support', 'privacy'] as const).map((kind) => ({
        url: absoluteSiteUrl(localizedAppRoute(locale, app.paths[kind])),
        priority: kind === 'app' ? 0.8 : 0.4,
      })),
    ),
  ]);
}
