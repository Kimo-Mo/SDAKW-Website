'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { NavLink } from './nav-link';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import type { PublicHeaderProps, PublicNavigationItem } from '@/types/public';
import Image from 'next/image';
import { LanguageSwitcher } from '@/components/shared/language-switcher';

const NAV_ITEMS: PublicNavigationItem[] = [
  { id: 'home', labelKey: 'home', href: '/', exactMatch: true },
  { id: 'about', labelKey: 'about', href: '/about', exactMatch: false },
  { id: 'projects', labelKey: 'projects', href: '/projects', exactMatch: false },
  { id: 'contact', labelKey: 'contact', href: '/contact', exactMatch: false },
];

export function PublicHeader({ locale, onOpenMobileNav }: PublicHeaderProps) {
  const t = useTranslations('public');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-background/85 backdrop-blur-md border-b border-border/60 shadow-xs'
          : 'bg-background/40 backdrop-blur-xs border-b border-transparent'
      }`}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-18 items-center justify-between">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center gap-2 group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
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
          <div className="flex flex-col text-start">
            <span className="font-heading font-bold tracking-tight text-base sm:text-lg text-foreground group-hover:text-primary transition-colors">
              {t('brand.shortName')}
            </span>
            <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline-block truncate max-w-50 xl:max-w-xs">
              {t('brand.tagline')}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.id} item={item} />
          ))}
        </nav>

        {/* Desktop Actions (Theme Toggle, Language Switcher & CTA) */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <LanguageSwitcher locale={locale} />
          <Link href="/contact">
            <Button
              size="sm"
              className="rounded-full px-4 h-9 font-medium shadow-xs hover:shadow-sm">
              {t('nav.getInTouch')}
            </Button>
          </Link>
        </div>

        {/* Mobile Actions (Language Switcher + Hamburger) */}
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
