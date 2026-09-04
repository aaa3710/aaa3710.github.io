import type { Locale } from '@/lib/site';

export type FormPurpose = 'contact' | 'app-feedback';

// Enable only after both localized forms have been checked against their purpose.
export const formReadiness: Record<FormPurpose, boolean> = {
  contact: process.env.NEXT_PUBLIC_CONTACT_READY === 'true',
  'app-feedback': process.env.NEXT_PUBLIC_APP_FEEDBACK_READY === 'true',
};

export const submissionNotice: Record<Locale, string> = {
  ja: '送信ボタンを押さなければ、開発者へ回答としては届きません。Google側での下書き保存や通常のWeb情報処理は別です。',
  en: 'Until you press Submit, the developer does not receive your text as a response. Google’s draft saving and ordinary web processing are separate.',
};

const responderUrls: Record<FormPurpose, Record<Locale, string>> = {
  contact: {
    ja: 'https://docs.google.com/forms/d/e/1FAIpQLSf6rKXgaPvHUx6kZI3J4bEwwzfsDJ0ToUXWEo0qDko2j14nww/viewform',
    en: 'https://docs.google.com/forms/d/e/1FAIpQLScAt6o2DzHGOTgflSDjjbPHq3tjZm3AmqogGLOkAUpkY_3Bjg/viewform',
  },
  'app-feedback': {
    ja: 'https://docs.google.com/forms/d/e/1FAIpQLSeIExpSJV8iJY0866WgjJPxhnMbDQSTg5lqukNU5YE-9fhxbw/viewform',
    en: 'https://docs.google.com/forms/d/e/1FAIpQLSeHQTMezEMlXcYxy6sY7rtoOItgaYLJdDvxVXO1-zMNrxghCw/viewform',
  },
};

function formUrl(purpose: FormPurpose, locale: Locale, embedded = false) {
  const url = responderUrls[purpose][locale];
  return embedded ? `${url}?embedded=true` : url;
}

export function feedbackFormUrl(locale: Locale, embedded = false) {
  return formUrl('app-feedback', locale, embedded);
}

export function contactFormUrl(locale: Locale, embedded = false) {
  return formUrl('contact', locale, embedded);
}
