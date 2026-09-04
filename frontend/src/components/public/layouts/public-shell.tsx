'use client';

import { useState } from 'react';
import { usePathname } from '@/i18n/navigation';
import { PublicHeader } from './header';
import { PublicMobileNav } from './mobile-nav';
import { PublicFooter } from './footer';
import { CustomCursor } from '@/components/shared/custom-cursor';
import type { PublicShellProps } from '@/types/public';
import TopUtilityBar from './topUtilityBar';

export function PublicShell({ children, locale }: PublicShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/10 selection:text-primary pattern">
      {/* Signature Architectural Custom Cursor (desktop fine pointer only) */}
      <CustomCursor />

      {/* Sticky Header */}
      <TopUtilityBar />
      <PublicHeader
        currentPath={pathname}
        locale={locale}
        onOpenMobileNav={() => setIsMobileNavOpen(true)}
      />

      {/* Off-canvas Mobile Drawer */}
      <PublicMobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        currentPath={pathname}
        locale={locale}
      />

      {/* Main Public Canvas */}
      <main className="flex-1 w-full flex flex-col">{children}</main>

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
}
