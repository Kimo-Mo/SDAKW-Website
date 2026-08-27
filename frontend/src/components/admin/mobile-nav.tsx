'use client';

import { useLocale, useTranslations } from 'next-intl';
import { LayoutDashboard, FolderKanban, FolderPlus, Settings, Globe } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { LogoutButton } from '@/components/auth/logout-button';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import Image from 'next/image';

interface AdminMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

export function AdminMobileNav({ isOpen, onClose, currentPath }: AdminMobileNavProps) {
  const t = useTranslations('admin');
  const locale = useLocale();

  const navItems = [
    {
      id: 'overview',
      label: t('nav.overview'),
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      id: 'projects',
      label: t('nav.projects'),
      href: '/admin/projects',
      icon: FolderKanban,
      exact: false,
    },
    {
      id: 'newProject',
      label: t('nav.newProject'),
      href: '/admin/projects/new',
      icon: FolderPlus,
      exact: true,
    },
    {
      id: 'settings',
      label: t('nav.settings'),
      href: '/admin/settings',
      icon: Settings,
      exact: true,
    },
  ];

  const isLinkActive = (href: string, exact: boolean) => {
    if (exact) {
      return currentPath === href;
    }
    return currentPath === href || currentPath.startsWith(`${href}/`);
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}>
      <SheetContent
        side="start"
        closeLabel={t('header.closeMenu')}
        className="p-0 gap-0 w-full max-w-xs sm:max-w-xs flex flex-col"
        aria-label={t('header.openMenu')}>
        {/* Drawer Header */}
        <SheetHeader className="flex flex-row h-16 items-center justify-between px-5 space-y-0 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="relative w-25 h-full">
              <Image
                src="/images/sdakw_logo.png"
                alt="logo"
                width={100}
                height={100}
                className="object-contain w-auto h-auto"
                priority
              />
            </div>
            <SheetTitle className="text-base tracking-tight font-heading">{t('brand')}</SheetTitle>
          </div>
        </SheetHeader>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.href, item.exact);

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}>
                <Icon
                  className={`h-4 w-4 shrink-0 ${active ? 'text-primary-foreground' : 'text-muted-foreground'}`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="my-3 border-t border-border pt-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{t('nav.viewWebsite')}</span>
            </a>
          </div>
        </nav>

        {/* Drawer Footer (Theme, Language & Sign out) */}
        <div className="border-t border-border p-4 bg-muted/20 mt-auto space-y-3">
          <ThemeToggle variant="mobile" />
          <LanguageSwitcher locale={locale} variant="mobile" onSwitch={onClose} />
          <LogoutButton className="w-full justify-start" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
