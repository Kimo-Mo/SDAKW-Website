'use client';

import { useTranslations } from 'next-intl';
import { LayoutDashboard, FolderKanban, FolderPlus, Settings, Globe } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { LogoutButton } from '@/components/auth/logout-button';
import Image from 'next/image';

interface AdminSidebarProps {
  currentPath: string;
  className?: string;
}

export function AdminSidebar({ currentPath, className = '' }: AdminSidebarProps) {
  const t = useTranslations('admin');

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
    <aside
      className={`hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:inset-s-0 bg-card border-e border-border z-30 ${className}`}>
      {/* Brand / Logo Area */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-6">
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
        <div className="flex flex-col">
          <span className="font-heading font-semibold text-sm leading-tight text-foreground">
            {t('brand')}
          </span>
          <span className="text-[11px] text-muted-foreground leading-tight">
            {t('header.userRole')}
          </span>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isLinkActive(item.href, item.exact);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all ${
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

        <div className="my-4 border-t border-border/70 pt-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span>{t('nav.viewWebsite')}</span>
          </a>
        </div>
      </nav>

      {/* Footer sign out */}
      <div className="border-t border-border p-4 bg-muted/20">
        <LogoutButton
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
        />
      </div>
    </aside>
  );
}
