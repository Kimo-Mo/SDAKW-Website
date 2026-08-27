'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/shared/password-input';
import { Spinner } from '@/components/ui/spinner';
import { AUTH_SESSION_QUERY_KEY, isUnauthorizedError } from '@/components/auth/session';
import { useRouter } from '@/i18n/navigation';
import { login, type LoginCredentials } from '@/lib/api/auth';
import { normalizeReturnPath, resetBrowserRedirectState } from '@/lib/auth/navigation';

interface LoginFormProps {
  returnTo?: string | null;
}

function buildLoginSchema(t: (key: string) => string) {
  return z.object({
    email: z.string().min(1, t('login.emailRequired')).email(t('login.emailInvalid')),
    password: z.string().min(1, t('login.passwordRequired')),
  });
}

export function LoginForm({ returnTo }: LoginFormProps) {
  const t = useTranslations('auth');
  const router = useRouter();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const loginSchema = useMemo(() => buildLoginSchema(t), [t]);
  type LoginFormValues = z.infer<typeof loginSchema>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      setServerError(null);
      resetBrowserRedirectState();
      queryClient.invalidateQueries({ queryKey: AUTH_SESSION_QUERY_KEY });
      router.push(normalizeReturnPath(returnTo));
    },
    onError: (error: unknown) => {
      setServerError(
        isUnauthorizedError(error) ? t('login.invalidCredentials') : t('login.serviceUnavailable')
      );
    },
  });

  const onSubmit = form.handleSubmit((values: LoginCredentials) => {
    setServerError(null);
    mutation.mutate(values);
  });

  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;

  return (
    <form onSubmit={onSubmit} noValidate className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-email" className="text-sm font-medium">
          {t('login.emailLabel')}
        </Label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(emailError)}
          placeholder={t('login.emailPlaceholder')}
          {...form.register('email')}
        />
        {emailError ? (
          <p role="alert" className="text-sm text-destructive">
            {emailError}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-password" className="text-sm font-medium">
          {t('login.passwordLabel')}
        </Label>
        <PasswordInput
          id="login-password"
          autoComplete="current-password"
          aria-invalid={Boolean(passwordError)}
          placeholder={t('login.passwordPlaceholder')}
          {...form.register('password')}
        />
        {passwordError ? (
          <p role="alert" className="text-sm text-destructive">
            {passwordError}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <div
          role="alert"
          className="border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {serverError}
        </div>
      ) : null}

      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? (
          <>
            <Spinner />
            {t('login.submitting')}
          </>
        ) : (
          t('login.submit')
        )}
      </Button>
    </form>
  );
}
