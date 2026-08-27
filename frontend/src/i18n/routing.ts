import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  localePrefix: 'as-needed',
});

export type Locale = (typeof routing.locales)[number];

const localeDirections: Record<Locale, 'ltr' | 'rtl'> = {
  ar: 'rtl',
  en: 'ltr',
};

const alternateLocales: Record<Locale, Locale> = {
  ar: 'en',
  en: 'ar',
};

export function getLocaleDirection(locale: Locale) {
  return localeDirections[locale];
}

export function getAlternateLocale(locale: Locale) {
  return alternateLocales[locale];
}
