import { getTranslations } from 'next-intl/server';

import { LogoutButton } from '@/components/auth/logout-button';

interface AdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth' });

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 p-4">
      <header className="flex flex-col gap-2 text-center">
        <h1 className="font-heading text-2xl font-medium tracking-tight">{t('protected.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('protected.description')}</p>
      </header>

      <LogoutButton />
    </main>
  );
}
