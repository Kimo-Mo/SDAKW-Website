import { LoginPage } from '@/components/auth/login-page';

interface LoginRouteProps {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}

export default async function LoginRoute({ searchParams }: LoginRouteProps) {
  const params = await searchParams;
  const returnTo = typeof params.returnTo === 'string' ? params.returnTo : null;

  return <LoginPage returnTo={returnTo} />;
}
