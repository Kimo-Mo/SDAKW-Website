'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { DirectionProvider } from '@/components/ui/direction';
import { Toaster } from '@/components/ui/toast';
import { getLocaleDirection, type Locale } from '@/i18n/routing';

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
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Kuwait">
      <DirectionProvider direction={getLocaleDirection(locale)}>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster />
        </QueryClientProvider>
      </DirectionProvider>
    </NextIntlClientProvider>
  );
}
