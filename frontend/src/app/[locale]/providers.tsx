'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { DirectionProvider } from '@/components/ui/direction';
import { Toaster } from '@/components/ui/toast';
import { getLocaleDirection, type Locale } from '@/i18n/routing';

// Suppress known React 19 false-positive warning for next-themes inline SSR flash-prevention script
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag')) {
      return;
    }
    originalError(...args);
  };
}

interface ProvidersProps {
  children: ReactNode;
  messages: Record<string, unknown>;
  locale: Locale;
}

export function Providers({ children, messages, locale }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Kuwait">
        <DirectionProvider direction={getLocaleDirection(locale)}>
          <QueryClientProvider client={queryClient}>
            {children}
            <Toaster />
          </QueryClientProvider>
        </DirectionProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
