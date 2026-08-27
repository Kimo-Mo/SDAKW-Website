import { cookies } from 'next/headers';

import { LoginPage } from '@/components/auth/login-page';
import { redirect } from '@/i18n/navigation';
import { normalizeReturnPath } from '@/lib/auth/navigation';

interface LoginRouteProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ returnTo?: string | string[] }>;
}

export default async function LoginRoute({ params, searchParams }: LoginRouteProps) {
  const { locale } = await params;
  const search = await searchParams;
  const returnTo = typeof search.returnTo === 'string' ? search.returnTo : null;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  let isAuthenticated = false;

  if (cookieHeader.trim().length > 0) {
    const rawApiUrl =
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:5000/api/v1';

    const apiUrl = rawApiUrl.replace(/\/+$/, '');

    try {
      const response = await fetch(`${apiUrl}/auth/me`, {
        method: 'GET',
        headers: {
          Cookie: cookieHeader,
        },
        cache: 'no-store',
      });

      if (response.ok) {
        isAuthenticated = true;
      }
    } catch {
      // Backend unreachable or network failure — fall back to displaying the login form
    }
  }

  if (isAuthenticated) {
    redirect({ href: normalizeReturnPath(returnTo), locale }, 'replace');
  }

  return <LoginPage returnTo={returnTo} />;
}
