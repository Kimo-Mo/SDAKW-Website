'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

import { usePathname } from '@/i18n/navigation';
import { AdminSidebar } from './sidebar';
import { AdminHeader } from './header';
import { AdminMobileNav } from './mobile-nav';

interface AdminDashboardShellProps {
  children: ReactNode;
  title?: string;
}

export function AdminDashboardShell({ children, title }: AdminDashboardShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Desktop Sidebar (Fixed start) */}
      <AdminSidebar currentPath={pathname} />

      {/* Mobile Drawer */}
      <AdminMobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        currentPath={pathname}
      />

      {/* Main Layout Area (Offset by sidebar on desktop via logical padding-inline-start) */}
      <div className="flex flex-1 flex-col lg:ps-64 transition-all duration-200">
        {/* Top Header */}
        <AdminHeader onOpenMobileNav={() => setIsMobileNavOpen(true)} title={title} />

        {/* Page Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
