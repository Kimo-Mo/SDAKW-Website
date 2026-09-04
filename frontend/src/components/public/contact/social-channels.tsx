'use client';

import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Reveal, RevealItem } from '@/components/shared/reveal';
import type { SocialChannelsProps } from '@/types/public';
import { cn } from '@/lib/utils';
import { FacebookIcon, InstagramIcon, LinkedinIcon, WhatsappIcon } from '@/components/shared/social-icons';


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
      handle: '+96550979575',
      url: 'https://wa.me/+96550979575',
      icon: WhatsappIcon,
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
                      <Icon className="h-5 w-5 text-foreground " />
                      <ArrowUpRight
                        className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground rtl:-scale-x-100"
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
