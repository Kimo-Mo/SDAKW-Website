'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/shared/password-input';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import { changePassword } from '@/lib/api/auth';
import {
  buildChangePasswordSchema,
  type ChangePasswordFormValues,
} from '@/lib/validations/change-password';

export function ChangePasswordForm() {
  const t = useTranslations('auth');
  const tAdmin = useTranslations('admin.settings');
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = useMemo(() => buildChangePasswordSchema(t), [t]);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setServerError(null);
      form.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.add({
        title: t('changePassword.successTitle'),
        description: t('changePassword.successMessage'),
        type: 'success',
      });
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setServerError(t('changePassword.errors.incorrectCurrentPassword'));
          return;
        }
        const serverMessage = error.response?.data?.message;
        if (serverMessage && typeof serverMessage === 'string') {
          setServerError(serverMessage);
          return;
        }
      }
      setServerError(t('changePassword.errors.serviceUnavailable'));
    },
  });

  const onSubmit = form.handleSubmit((values: ChangePasswordFormValues) => {
    setServerError(null);
    mutation.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  });

  const currentPasswordError = form.formState.errors.currentPassword?.message;
  const newPasswordError = form.formState.errors.newPassword?.message;
  const confirmPasswordError = form.formState.errors.confirmPassword?.message;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tAdmin('securityCardTitle')}</CardTitle>
        <CardDescription>{tAdmin('securityCardDesc')}</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
          {serverError ? (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive font-medium">
              {serverError}
            </div>
          ) : null}

          {/* Current Password */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="current-password" className="text-sm font-medium text-foreground">
              {t('changePassword.currentPasswordLabel')}
            </Label>
            <PasswordInput
              id="current-password"
              autoComplete="current-password"
              aria-invalid={Boolean(currentPasswordError)}
              placeholder={t('changePassword.currentPasswordPlaceholder')}
              {...form.register('currentPassword')}
            />
            {currentPasswordError ? (
              <p role="alert" className="text-xs text-destructive font-medium">
                {currentPasswordError}
              </p>
            ) : null}
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-password" className="text-sm font-medium text-foreground">
              {t('changePassword.newPasswordLabel')}
            </Label>
            <PasswordInput
              id="new-password"
              autoComplete="new-password"
              aria-invalid={Boolean(newPasswordError)}
              placeholder={t('changePassword.newPasswordPlaceholder')}
              {...form.register('newPassword')}
            />
            <p className="text-xs text-muted-foreground">{t('changePassword.passwordHelp')}</p>
            {newPasswordError ? (
              <p role="alert" className="text-xs text-destructive font-medium">
                {newPasswordError}
              </p>
            ) : null}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
              {t('changePassword.confirmPasswordLabel')}
            </Label>
            <PasswordInput
              id="confirm-password"
              autoComplete="new-password"
              aria-invalid={Boolean(confirmPasswordError)}
              placeholder={t('changePassword.confirmPasswordPlaceholder')}
              {...form.register('confirmPassword')}
            />
            {confirmPasswordError ? (
              <p role="alert" className="text-xs text-destructive font-medium">
                {confirmPasswordError}
              </p>
            ) : null}
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
              {mutation.isPending ? (
                <>
                  <Spinner className="me-2" />
                  {t('changePassword.submitting')}
                </>
              ) : (
                t('changePassword.submit')
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
