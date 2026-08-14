import type { ReactNode } from 'react';

import { RequireSession } from '@/components/auth/require-session';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <RequireSession>{children}</RequireSession>;
}
