import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const common = (await import(`../../translations/${locale}/common.json`)).default;
  const auth = (await import(`../../translations/${locale}/auth.json`)).default;
  const dashboard = (await import(`../../translations/${locale}/dashboard.json`)).default;
  const projects = (await import(`../../translations/${locale}/projects.json`)).default;

  return {
    locale,
    messages: {
      ...common,
      ...auth,
      admin: {
        ...dashboard.admin,
        ...projects.admin,
      },
    },
  };
});
