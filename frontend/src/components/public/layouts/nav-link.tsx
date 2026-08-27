'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import type { NavLinkProps } from '@/types/public';

export function NavLink({ item, onClick, className = '' }: NavLinkProps) {
  const t = useTranslations('public.nav');
  const pathname = usePathname();

  const isActive = item.exactMatch
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={`relative inline-flex items-center justify-center text-sm transition-all duration-200 rounded-lg px-3.5 py-2 ${
        isActive
          ? 'text-primary font-semibold'
          : 'text-muted-foreground font-medium hover:text-foreground hover:bg-accent/60'
      } ${className}`}>
      <span>{t(item.labelKey)}</span>
      {isActive && (
        <span
          className="absolute bottom-0 inset-x-3 h-0.5 bg-primary rounded-full"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}
