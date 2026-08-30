import type { Locale } from '@/lib/site';

export type FeedbackScope = 'all' | 'focus-map';

const responderUrls: Record<FeedbackScope, Record<Locale, string>> = {
  all: {
    ja: 'https://docs.google.com/forms/d/e/1FAIpQLSf6rKXgaPvHUx6kZI3J4bEwwzfsDJ0ToUXWEo0qDko2j14nww/viewform',
    en: 'https://docs.google.com/forms/d/e/1FAIpQLScAt6o2DzHGOTgflSDjjbPHq3tjZm3AmqogGLOkAUpkY_3Bjg/viewform',
  },
  'focus-map': {
    ja: 'https://docs.google.com/forms/d/e/1FAIpQLSeIExpSJV8iJY0866WgjJPxhnMbDQSTg5lqukNU5YE-9fhxbw/viewform',
    en: 'https://docs.google.com/forms/d/e/1FAIpQLSeHQTMezEMlXcYxy6sY7rtoOItgaYLJdDvxVXO1-zMNrxghCw/viewform',
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
