'use client';

import { useTranslations } from 'next-intl';

import Image from 'next/image';

import { LoginForm } from './login-form';

interface LoginPageProps {
  returnTo?: string | null;
}

export function LoginPage({ returnTo }: LoginPageProps) {
  const t = useTranslations('auth');

  return (
    <main className="flex min-h-svh w-full flex-col lg:flex-row">
      {/* Brand panel — solid ink surface, deliberately restrained */}
      <section
        aria-hidden="true"
        className="flex shrink-0 flex-col justify-between gap-8 bg-foreground p-6 text-background sm:p-10 lg:w-1/2 lg:p-12">
        <div className="flex items-center gap-3.5">
          <div className="rounded-xl bg-[#FAF8F5] p-2.5 shadow-sm inline-flex items-center justify-center border border-[#E5DFD6]">
            <Image
              src="/images/sdakw-logo.webp"
              alt="SDAKW Logo"
              width={100}
              height={67}
              className="h-10 sm:h-12 w-auto object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-xl font-bold tracking-tight text-background sm:text-2xl">
              SDAKW
            </span>
            <span className="text-xs text-background/70 font-medium">Salem Duwaih Al Ajmi Co.</span>
          </div>
        </div>
        <p className="text-sm text-background/70 sm:text-base">{t('login.brandTagline')}</p>
      </section>

      {/* Form panel — vertically centered on the standard surface */}
      <section className="flex flex-1 items-center justify-center border-border lg:border-s">
        <div className="w-full max-w-sm px-4 py-12 sm:px-6 sm:py-16 lg:py-0">
          <header className="mb-8 flex flex-col gap-2">
            <h1 className="font-heading text-2xl font-medium tracking-tight">{t('login.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('login.intro')}</p>
          </header>

          <LoginForm returnTo={returnTo} />
        </div>
      </section>
    </main>
  );
}
