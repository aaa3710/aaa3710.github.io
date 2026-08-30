import type { MetadataRoute } from 'next';
import { absoluteSiteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-08-30T00:00:00+09:00');

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
      url: absoluteSiteUrl('/apps/focus-map/'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: absoluteSiteUrl('/en/apps/focus-map/'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: absoluteSiteUrl('/privacy/focus-map/'),
      lastModified,
      priority: 0.5,
    },
    {
      url: absoluteSiteUrl('/en/privacy/focus-map/'),
      lastModified,
      priority: 0.4,
    },
    {
      url: absoluteSiteUrl('/support/focus-map/'),
      lastModified,
      priority: 0.5,
    },
    {
      url: absoluteSiteUrl('/en/support/focus-map/'),
      lastModified,
      priority: 0.4,
    },
    {
      url: absoluteSiteUrl('/feedback/'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: absoluteSiteUrl('/en/feedback/'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
