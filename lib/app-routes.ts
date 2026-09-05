// App pages share one namespace. Assets and future non-app pages stay separate.
export function localizedAppRoute(locale: 'ja' | 'en', path = '/apps/') {
  if (!path.startsWith('/apps/') || path.startsWith('/apps/en/')) {
    throw new Error('Expected a Japanese app route beginning with /apps/');
  }
  return locale === 'en' ? path.replace('/apps/', '/apps/en/') : path;
}

// Adapt links in immutable app-owned copy without editing its source snapshot.
// Only the former app namespace is migrated; unrelated future paths pass through.
export function migrateLegacyAppRoute(path: string) {
  if (path === '/' || path === '/en/') {
    return path === '/' ? '/apps/' : '/apps/en/';
  }
  if (path.startsWith('/en/apps/')) {
    return path.replace('/en/apps/', '/apps/en/');
  }
  if (/^\/(?:en\/)?(?:support|privacy|feedback|contact)\//.test(path)) {
    return `/apps${path}`;
  }
  return path;
}
