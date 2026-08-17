'use client';

import { useTranslations } from 'next-intl';

import { LoginForm } from './login-form';

interface LoginPageProps {
  returnTo?: string | null;
}

export function LoginPage({ returnTo }: LoginPageProps) {
  const t = useTranslations('auth');

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 p-4">
      <header className="flex flex-col gap-2 text-center">
        <h1 className="font-heading text-2xl font-medium tracking-tight">{t('login.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('login.intro')}</p>
      </header>

      <LoginForm returnTo={returnTo} />
    </main>
  );
}
