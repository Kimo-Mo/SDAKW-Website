import fs from 'fs';
import path from 'path';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

function readTranslationJson(locale: string, filename: string) {
  try {
    const filePath = path.join(process.cwd(), 'translations', locale, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch {
    return {};
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const common = readTranslationJson(locale, 'common.json');
  const auth = readTranslationJson(locale, 'auth.json');
  const dashboard = readTranslationJson(locale, 'dashboard.json');
  const projects = readTranslationJson(locale, 'projects.json');
  const publicContent = readTranslationJson(locale, 'public.json');

  return {
    locale,
    messages: {
      ...common,
      ...auth,
      ...publicContent,
      public: publicContent,
      admin: {
        ...dashboard.admin,
        ...projects.admin,
      },
    },
  };
});
