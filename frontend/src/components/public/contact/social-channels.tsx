'use client';

import { useTranslations } from 'next-intl';
import { ArrowUpRight, MessageSquare } from 'lucide-react';
import { Reveal, RevealItem } from '@/components/shared/reveal';
import type { SocialChannelsProps } from '@/types/public';
import { cn } from '@/lib/utils';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="0" ry="0" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

/**
 * Social Media Channels Grid
 * Provides verified links for Instagram, LinkedIn, Facebook, and WhatsApp
 * formatted as a monolithic specification matrix.
 */
export function SocialChannels({ className }: SocialChannelsProps) {
  const t = useTranslations('public');

  const channels = [
    {
      name: 'Instagram',
      handle: '@sdakw',
      url: 'https://instagram.com/sdakw',
      icon: InstagramIcon,
      tag: 'VISUAL ARCHIVE',
    },
    {
      name: 'LinkedIn',
      handle: 'Salem Duwaih Al Ajmi Co.',
      url: 'https://linkedin.com/company/sdakw',
      icon: LinkedinIcon,
      tag: 'CORPORATE NETWORK',
    },
    {
      name: 'Facebook',
      handle: 'SDA General Trading & Contracting',
      url: 'https://facebook.com/sdakw',
      icon: FacebookIcon,
      tag: 'COMMUNITY & NEWS',
    },
    {
      name: 'WhatsApp',
      handle: '+965 2200 0000',
      url: 'https://wa.me/96522000000',
      icon: MessageSquare,
      tag: 'DIRECT MESSAGING',
    },
  ];

  return (
    <section
      aria-labelledby="social-channels-heading"
      className={cn('space-y-8 text-start w-full', className)}>
      {/* Header section with asymmetric editorial staging */}
      <Reveal variant="fade-scale">
        <div className="space-y-3 max-w-3xl border-b border-border pb-6">
          <div className="text-xs font-mono rtl:font-sans font-semibold tracking-widest rtl:tracking-normal text-muted-foreground uppercase">
            02 // {t('contactPage.social.heading')}
          </div>

          <h2
            id="social-channels-heading"
            className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
            {t('contactPage.social.heading')}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            {t('contactPage.social.subtitle')}
          </p>
        </div>
      </Reveal>

      <Reveal variant="stagger-children" staggerDelay={0.08}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {channels.map((channel) => {
            const Icon = channel.icon;

            return (
              <RevealItem key={channel.name}>
                <a
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col justify-between border border-border bg-card p-5 sm:p-6 shadow-xs transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-foreground/40 hover:bg-muted/20 hover:shadow-md cursor-pointer relative h-full space-y-4 motion-reduce:transform-none">
                  <div className="space-y-3">
                    {/* Top Metadata Header Bar */}
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <Icon className="h-5 w-5 text-foreground" />
                      <ArrowUpRight
                        className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground rtl:rotate-180"
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="font-heading text-base font-bold text-foreground transition-colors group-hover:text-foreground">
                      {channel.name}
                    </h3>

                    <p
                      dir="ltr"
                      className="font-mono text-xs text-muted-foreground truncate text-start">
                      {channel.handle}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/40 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                    {channel.tag}
                  </div>
                </a>
              </RevealItem>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
