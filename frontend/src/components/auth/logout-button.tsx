'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { AUTH_SESSION_QUERY_KEY } from '@/components/auth/session';
import { useRouter } from '@/i18n/navigation';
import { logout } from '@/lib/api/auth';
import { resetBrowserRedirectState } from '@/lib/auth/navigation';

interface LogoutButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function LogoutButton({
  className,
  variant = 'outline',
  size = 'default',
}: LogoutButtonProps = {}) {
  const t = useTranslations('auth');
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setError(null);
      resetBrowserRedirectState();
      queryClient.clear();
      queryClient.removeQueries({ queryKey: AUTH_SESSION_QUERY_KEY });
      router.push('/login');
    },
    onError: () => {
      setError(t('signOut.failure'));
    },
  });

  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      {error ? (
        <div role="alert" className="flex flex-col items-center gap-1 text-center">
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-2 text-xs text-destructive">
            {t('signOut.failure')}
          </p>
        </div>
      ) : null}
      <Button
        variant={variant}
        size={size}
        disabled={mutation.isPending}
        onClick={() => mutation.mutate()}
        className={className}>
        {mutation.isPending ? (
          <>
            <Spinner />
            <span>{t('signOut.pending')}</span>
          </>
        ) : (
          <span>{t('signOut.label')}</span>
        )}
      </Button>
    </div>
  );
}
