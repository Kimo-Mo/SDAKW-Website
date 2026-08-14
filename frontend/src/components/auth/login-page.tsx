'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { LoadingState } from '@/components/shared/loading-state';
import { AUTH_SESSION_QUERY_KEY, isUnauthorizedError } from '@/components/auth/session';
import { useRouter } from '@/i18n/navigation';
import { getCurrentAdmin } from '@/lib/api/auth';
import { normalizeReturnPath } from '@/lib/auth/navigation';
import { LoginForm } from './login-form';

interface LoginPageProps {
  returnTo?: string | null;
}

export function LoginPage({ returnTo }: LoginPageProps) {
  const t = useTranslations('auth');
  const router = useRouter();

  const session = useQuery({
    queryKey: AUTH_SESSION_QUERY_KEY,
    queryFn: getCurrentAdmin,
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (session.isSuccess) {
      router.replace(normalizeReturnPath(returnTo));
    }
  }, [session.isSuccess, router, returnTo]);

  if (session.isPending) {
    return (
      <LoadingState label={t('session.checking')} description={t('session.checkingDescription')} />
    );
  }

  const sessionCheckFailed = session.isError && !isUnauthorizedError(session.error);

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 p-4">
      <header className="flex flex-col gap-2 text-center">
        <h1 className="font-heading text-2xl font-medium tracking-tight">{t('login.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('login.intro')}</p>
      </header>

      {sessionCheckFailed ? (
        <p
          role="alert"
          className="rounded-lg border border-border bg-muted p-3 text-center text-sm">
          {t('login.sessionCheckNotice')}
        </p>
      ) : null}

      <LoginForm returnTo={returnTo} />
    </main>
  );
}
