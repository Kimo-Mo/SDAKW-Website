'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import type { PublicMobileNavProps, PublicNavigationItem } from '@/types/public';

const NAV_ITEMS: PublicNavigationItem[] = [
  { id: 'home', labelKey: 'home', href: '/', exactMatch: true },
  { id: 'about', labelKey: 'about', href: '/about', exactMatch: false },
  { id: 'projects', labelKey: 'projects', href: '/projects', exactMatch: false },
  { id: 'contact', labelKey: 'contact', href: '/contact', exactMatch: false },
];

export function PublicMobileNav({
  isOpen,
  onClose,
  currentPath,
  locale,
}: PublicMobileNavProps) {
  const t = useTranslations('public');
  const isRtl = locale === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const isLinkActive = (href: string, exact: boolean = false) => {
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
        closeLabel={t('nav.closeMenu')}
        className="p-0 gap-0 w-full max-w-xs sm:max-w-sm flex flex-col"
        aria-label={t('nav.menu')}>
        {/* Drawer Header */}
        <SheetHeader className="flex flex-row h-18 items-center justify-between px-5 space-y-0 border-b border-border">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              SD
            </span>
            <SheetTitle className="font-heading font-bold tracking-tight text-base text-foreground">
              {t('brand.shortName')}
            </SheetTitle>
          </Link>
        </SheetHeader>

        {/* Drawer Navigation List */}
        <nav className="flex-1 overflow-y-auto p-5 space-y-2">
          {NAV_ITEMS.map((item) => {
            const active = isLinkActive(item.href, item.exactMatch);
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}>
                <span>{t(`nav.${item.labelKey}`)}</span>
                <ArrowIcon
                  className={`h-4 w-4 opacity-70 ${
                    active ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Drawer Actions & Footer */}
        <div className="border-t border-border p-5 space-y-3 bg-muted/20 mt-auto">
          <LanguageSwitcher locale={locale} variant="mobile" onSwitch={onClose} />

          <Link href="/contact" onClick={onClose} className="block w-full">
            <Button className="w-full h-10 font-medium rounded-xl shadow-xs">
              {t('nav.getInTouch')}
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
