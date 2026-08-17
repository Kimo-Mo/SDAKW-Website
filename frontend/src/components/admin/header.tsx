'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Menu, Globe } from 'lucide-react';

import { Link, usePathname } from '@/i18n/navigation';
import { getAlternateLocale, type Locale } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { LogoutButton } from '@/components/auth/logout-button';

interface AdminHeaderProps {
  onOpenMobileNav: () => void;
  title?: string;
  className?: string;
}

export function AdminHeader({ onOpenMobileNav, title, className = '' }: AdminHeaderProps) {
  const t = useTranslations('admin');
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  const alternateLocale = getAlternateLocale(locale);
  const displayTitle = title || t('header.title');

  return (
    <header
      className={`sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 ${className}`}>
      {/* Start: Mobile trigger & Page title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenMobileNav}
          aria-label={t('header.openMenu')}
          className="lg:hidden h-9 w-9 text-muted-foreground hover:text-foreground">
          <Menu className="h-5 w-5" />
        </Button>

        <h1 className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          {displayTitle}
        </h1>
      </div>

      {/* End: Controls (Locale switcher & Sign out) */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Locale Switcher */}
        <Link
          href={pathname}
          locale={alternateLocale}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label={t('header.switchLanguage')}>
          <Globe className="h-3.5 w-3.5" />
          <span>{t('header.switchLanguage')}</span>
        </Link>

        {/* Header Sign out */}
        <LogoutButton variant="ghost" size="sm" className="hidden sm:flex hover:text-destructive" />
      </div>
    </header>
  );
}
