'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { LogoutButton } from '@/components/auth/logout-button';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { ThemeToggle } from '@/components/shared/theme-toggle';

interface AdminHeaderProps {
  onOpenMobileNav: () => void;
  title?: string;
  className?: string;
}

export function AdminHeader({ onOpenMobileNav, title, className = '' }: AdminHeaderProps) {
  const t = useTranslations('admin');
  const locale = useLocale();

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

      {/* End: Controls (Theme Toggle, Locale switcher & Sign out) */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Theme Toggle */}
        <ThemeToggle variant="admin" className="hidden lg:flex" />

        {/* Locale Switcher */}
        <LanguageSwitcher locale={locale} variant="admin" />

        {/* Header Sign out */}
        <LogoutButton variant="ghost" size="sm" className="hidden sm:flex hover:text-destructive" />
      </div>
    </header>
  );
}
