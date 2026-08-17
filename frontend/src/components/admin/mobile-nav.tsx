'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { LayoutDashboard, FolderKanban, FolderPlus, Settings, Globe, X } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { LogoutButton } from '@/components/auth/logout-button';

interface AdminMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

export function AdminMobileNav({ isOpen, onClose, currentPath }: AdminMobileNavProps) {
  const t = useTranslations('admin');

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 lg:hidden" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 inset-s-0 z-50 flex w-full max-w-xs flex-col bg-card border-e border-border shadow-2xl transition-transform duration-200">
        {/* Drawer Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              SD
            </span>
            <span className="font-heading font-semibold tracking-tight text-base">
              {t('brand')}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label={t('header.closeMenu')}
            className="h-9 w-9 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </Button>
        </div>

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

        {/* Drawer Footer (Sign out) */}
        <div className="border-t border-border p-4 bg-muted/20">
          <LogoutButton className="w-full justify-start" />
        </div>
      </div>
    </div>
  );
}
