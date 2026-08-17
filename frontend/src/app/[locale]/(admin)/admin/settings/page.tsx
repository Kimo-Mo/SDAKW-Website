'use client';

import { useTranslations } from 'next-intl';
import { ChangePasswordForm } from '@/components/admin/settings/change-password-form';

export default function SettingsPage() {
  const t = useTranslations('admin.settings');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {t('title')}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t('subtitle')}</p>
      </div>

      <ChangePasswordForm />
    </div>
  );
}
