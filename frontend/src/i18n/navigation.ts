import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

// All app navigation MUST go through this i18n-aware layer — never import
// `next/link` or `next/navigation`'s router/pathname directly in components.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
