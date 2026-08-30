import type { Locale } from '@/lib/site';

export type FeedbackScope = 'all' | 'focus-map';

const responderUrls: Record<FeedbackScope, Record<Locale, string>> = {
  all: {
    ja: 'https://docs.google.com/forms/d/1gqWPpvV2X2jkF46fy-PBFzrQHSs8T0x3RmCdd4USuDQ/viewform',
    en: 'https://docs.google.com/forms/d/1j7_E9NZB-uKkkUnkbLmmnkkwngiwecqAftHJxx6Z4yI/viewform',
  },
  'focus-map': {
    ja: 'https://docs.google.com/forms/d/1iijsyTqWhZAzPtXa66znCVPm69rr0hJZA1yEmHgYOB4/viewform',
    en: 'https://docs.google.com/forms/d/1sVvGCx_DjFTnUUqmvJdqlb0aVoYCu8tZUBlaPACnyrg/viewform',
  },
};

export function feedbackFormUrl(
  scope: FeedbackScope,
  locale: Locale,
  embedded = false,
) {
  const url = responderUrls[scope][locale];
  return embedded ? `${url}?embedded=true` : url;
}
