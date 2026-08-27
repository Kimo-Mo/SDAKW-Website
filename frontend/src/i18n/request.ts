import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const [common, auth, dashboard, projects, publicContent] = await Promise.all([
    import(`../../translations/${locale}/common.json`).then((m) => m.default),
    import(`../../translations/${locale}/auth.json`).then((m) => m.default),
    import(`../../translations/${locale}/dashboard.json`).then((m) => m.default),
    import(`../../translations/${locale}/projects.json`).then((m) => m.default),
    import(`../../translations/${locale}/public.json`).then((m) => m.default),
  ]);

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

