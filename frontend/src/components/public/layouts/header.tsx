'use client';

import { useTranslations } from 'next-intl';
import { Menu } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { NavLink } from './nav-link';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import type { PublicHeaderProps, PublicNavigationItem } from '@/types/public';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import HeaderLogo from './headerLogo';

const FIRST_NAV_ITEMS: PublicNavigationItem[] = [
  { id: 'home', labelKey: 'home', href: '/', exactMatch: true },
  { id: 'about', labelKey: 'about', href: '/about', exactMatch: false },
];
const SECOND_NAV_ITEMS: PublicNavigationItem[] = [
  { id: 'projects', labelKey: 'projects', href: '/projects', exactMatch: false },
  { id: 'products', labelKey: 'products', href: '/products', exactMatch: false },
];

export function PublicHeader({ locale, onOpenMobileNav }: PublicHeaderProps) {
  const t = useTranslations('public');

  return (
    <header className="sticky top-0 z-40 w-full shadow-xs backdrop-blur-sm bg-background">
      <div
        className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 h-16 lg:h-20`}>
        {/* Desktop Actions (Theme Toggle, Language Switcher) */}
        <div className="hidden lg:flex items-center gap-2">
          <LanguageSwitcher locale={locale} />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 h-full">
          {/* First Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {FIRST_NAV_ITEMS.map((item) => (
              <NavLink key={item.id} item={item} />
            ))}
          </nav>

          {/* Brand Logo & Name */}
          <HeaderLogo />

          {/* Second Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {SECOND_NAV_ITEMS.map((item) => (
              <NavLink key={item.id} item={item} />
            ))}
          </nav>
        </div>

        {/* Desktop Actions (CTA) */}
        <div className="hidden lg:block">
          <Link href="/contact">
            <Button
              size="sm"
              className="px-4 h-9 font-medium">
              {t('nav.getInTouch')}
            </Button>
          </Link>
        </div>

        {/* Mobile Actions (Hamburger Menu) */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenMobileNav}
            aria-label={t('nav.menu')}
            className="h-11 w-11 min-h-11 min-w-11 rounded-xl text-foreground hover:bg-accent flex items-center justify-center">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
