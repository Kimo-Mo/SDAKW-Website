import { PublicShell } from '@/components/public/layouts/public-shell';

interface PublicLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function PublicLayout({ children, params }: PublicLayoutProps) {
  const { locale } = await params;

  return <PublicShell locale={locale}>{children}</PublicShell>;
}
