import { getPathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

const ADMIN_LANDING = '/admin';

let redirectInProgress = false;

/**
 * Normalizes a return destination. Only the `/admin` path or one of its
 * children survives; blank, external, protocol-relative, `javascript:`,
 * malformed, and non-admin values fall back to `/admin`.
 */
export function normalizeReturnPath(value: string | null | undefined): string {
  if (typeof value !== 'string' || value.length === 0 || !value.startsWith('/')) {
    return ADMIN_LANDING;
  }

  let pathname: string;
  try {
    pathname = new URL(value, 'http://sda-kw.local').pathname;
  } catch {
    return ADMIN_LANDING;
  }

  pathname = pathname.replace(/\/+$/, '') || '/';

  if (pathname === ADMIN_LANDING || pathname.startsWith(`${ADMIN_LANDING}/`)) {
    return pathname;
  }

  return ADMIN_LANDING;
}

/** Builds the login URL, preserving a safe returnTo query param if non-default. */
export function createLoginHref(locale?: Locale, returnTo?: string | null): string {
  const loc = locale ?? routing.defaultLocale;
  const safeReturn = returnTo ? normalizeReturnPath(returnTo) : null;
  if (!safeReturn || safeReturn === ADMIN_LANDING) {
    return getPathname({ href: '/login', locale: loc });
  }
  return getPathname({
    href: { pathname: '/login', query: { returnTo: safeReturn } },
    locale: loc,
  });
}

/** True when the given pathname is the login route. */
export function isLoginPathname(pathname: string): boolean {
  const clean = pathname.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
  return clean === '/login';
}

/** Alias for backward compatibility. */
export const isLocalizedLoginPathname = isLoginPathname;

/**
 * Browser-only navigation to the login route with a validated return destination.
 * Intended for the shared Axios 401 handler:
 *
 * - does nothing during server rendering,
 * - refuses to redirect while already on the login route,
 * - prevents duplicate redirects while one is already in progress.
 */
export function redirectToLoginBrowser(returnTo?: string | null, locale?: Locale): void {
  if (typeof window === 'undefined') return;

  const pathname = window.location.pathname;

  if (isLoginPathname(pathname)) return;
  if (redirectInProgress) return;

  redirectInProgress = true;
  const target = returnTo ?? pathname;
  const activeLocale =
    locale ??
    (document.cookie.match(/NEXT_LOCALE=([^;]+)/)?.[1] as Locale) ??
    routing.defaultLocale;
  window.location.assign(createLoginHref(activeLocale, target));
}

/** Clears the single-navigation redirect guard. */
export function resetBrowserRedirectState(): void {
  redirectInProgress = false;
}


