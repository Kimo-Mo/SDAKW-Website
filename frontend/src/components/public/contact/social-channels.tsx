import React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUpRight, MessageSquare, Share2 } from 'lucide-react';
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
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
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
 * Provides verified links for Instagram, LinkedIn, Facebook, and WhatsApp.
 */
export function SocialChannels({ className }: SocialChannelsProps) {
  const t = useTranslations('public');

  const channels = [
    {
      name: 'Instagram',
      handle: '@sdakw',
      url: 'https://instagram.com/sdakw',
      icon: InstagramIcon,
      color: 'hover:text-pink-600 hover:border-pink-500/40',
    },
    {
      name: 'LinkedIn',
      handle: 'Salem Dwaih Al Ajmi Co.',
      url: 'https://linkedin.com/company/sdakw',
      icon: LinkedinIcon,
      color: 'hover:text-blue-600 hover:border-blue-500/40',
    },
    {
      name: 'Facebook',
      handle: 'SDA General Trading & Contracting',
      url: 'https://facebook.com/sdakw',
      icon: FacebookIcon,
      color: 'hover:text-blue-700 hover:border-blue-600/40',
    },
    {
      name: 'WhatsApp',
      handle: '+965 2200 0000',
      url: 'https://wa.me/96522000000',
      icon: MessageSquare,
      color: 'hover:text-emerald-600 hover:border-emerald-500/40',
    },
  ];

  return (
    <section
      aria-labelledby="social-channels-heading"
      className={cn('space-y-6 text-start', className)}>
      <div className="space-y-1.5 max-w-2xl">
        <div className="flex items-center gap-2">
          <Share2 className="h-4 w-4 text-primary" aria-hidden="true" />
          <h2
            id="social-channels-heading"
            className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {t('contactPage.social.heading')}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {t('contactPage.social.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {channels.map((channel) => {
          const Icon = channel.icon;

          return (
            <a
              key={channel.name}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'group flex items-center justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-xs transition-all duration-300 hover:shadow-md cursor-pointer relative',
                channel.color
              )}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/60 text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold text-foreground group-hover:text-inherit transition-colors">
                    {channel.name}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate max-w-35">
                    {channel.handle}
                  </p>
                </div>
              </div>

              <ArrowUpRight
                className="absolute inset-e-4 top-4 h-4 w-4 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground rtl:scale-x-[-1]"
                aria-hidden="true"
              />
            </a>
          );
        })}
      </div>
    </section>
  );
}
