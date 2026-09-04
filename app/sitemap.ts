import type { MetadataRoute } from 'next';
import { absoluteSiteUrl, featuredAppPaths } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-09-04T00:00:00+09:00');

  return [
    {
      url: absoluteSiteUrl('/'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: absoluteSiteUrl('/en/'),
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
      url: absoluteSiteUrl(`/en${featuredAppPaths.app}`),
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
      url: absoluteSiteUrl(`/en${featuredAppPaths.privacy}`),
      lastModified,
      priority: 0.4,
    },
    {
      url: absoluteSiteUrl(featuredAppPaths.support),
      lastModified,
      priority: 0.5,
    },
    {
      url: absoluteSiteUrl(`/en${featuredAppPaths.support}`),
      lastModified,
      priority: 0.4,
    },
    {
      url: absoluteSiteUrl('/contact/'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: absoluteSiteUrl('/en/contact/'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
