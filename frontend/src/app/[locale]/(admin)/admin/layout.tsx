import type { ReactNode } from 'react';

import { RequireSession } from '@/components/auth/require-session';
import { AdminDashboardShell } from '@/components/admin/dashboard-shell';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <RequireSession>
      <AdminDashboardShell>{children}</AdminDashboardShell>
    </RequireSession>
  );
}
