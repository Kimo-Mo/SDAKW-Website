'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import { ErrorState } from '@/components/shared/error-state';
import { LoadingState } from '@/components/shared/loading-state';
import { AUTH_SESSION_QUERY_KEY, isUnauthorizedError } from '@/components/auth/session';
import { getCurrentAdmin } from '@/lib/api/auth';

interface RequireSessionProps {
  children: ReactNode;
}

/**
 * Gates protected content behind a verified backend session.
 *
 * - pending → LoadingState (no children leak)
 * - success → children
 * - 401 → no children; the shared Axios interceptor handles login redirect
 * - other failure → ErrorState with retry; no children
 */
export function RequireSession({ children }: RequireSessionProps) {
  const t = useTranslations('auth');

  const session = useQuery({
    queryKey: AUTH_SESSION_QUERY_KEY,
    queryFn: getCurrentAdmin,
    retry: false,
    staleTime: 0,
  });

  if (session.isPending) {
    return (
      <LoadingState label={t('session.checking')} description={t('session.checkingDescription')} />
    );
  }

  if (session.isError) {
    if (isUnauthorizedError(session.error)) {
      return null;
    }

    return (
      <ErrorState
        title={t('session.unavailable')}
        description={t('session.unavailableDescription')}
        retryLabel={t('session.retry')}
        onRetry={() => session.refetch()}
      />
    );
  }

  return <>{children}</>;
}
