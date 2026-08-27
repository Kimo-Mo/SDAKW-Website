import { useTranslations } from 'next-intl';
import { Award, Leaf, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Reveal } from '@/components/shared/reveal';
import type { CertificationsShowcaseProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Triple ISO Certifications Showcase Section
 * Implements a monolithic continuous accreditation matrix with sharp hairline
 * divisions, mono standard labels, and verified compliance markers.
 */
export function CertificationsShowcase({ className }: CertificationsShowcaseProps) {
  const t = useTranslations('public');

  const certs = [
    {
      key: 'iso9001',
      standard: t('aboutPage.certifications.iso9001.title'),
      name: t('aboutPage.certifications.iso9001.name'),
      description: t('aboutPage.certifications.iso9001.description'),
      icon: Award,
    },
    {
      key: 'iso14001',
      standard: t('aboutPage.certifications.iso14001.title'),
      name: t('aboutPage.certifications.iso14001.name'),
      description: t('aboutPage.certifications.iso14001.description'),
      icon: Leaf,
    },
    {
      key: 'iso45001',
      standard: t('aboutPage.certifications.iso45001.title'),
      name: t('aboutPage.certifications.iso45001.name'),
      description: t('aboutPage.certifications.iso45001.description'),
      icon: ShieldAlert,
    },
  ];

  return (
    <section
      aria-labelledby="certifications-heading"
      className={cn('space-y-8 text-start', className)}>
      {/* Section Header */}
      <Reveal variant="fade-scale">
        <div className="space-y-3 max-w-3xl border-b border-border pb-6">
          <div className="text-xs font-mono rtl:font-sans font-semibold tracking-widest rtl:tracking-normal text-muted-foreground uppercase">
            06 // {t('aboutPage.certifications.badge')}
          </div>
          <h2
            id="certifications-heading"
            className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
            {t('aboutPage.certifications.heading')}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t('aboutPage.certifications.subtitle')}
          </p>
        </div>
      </Reveal>

      {/* Monolithic Continuous ISO Accreditation Matrix */}
      <Reveal variant="fade-scale" delay={0.1}>
        <div className="border border-border bg-card divide-y md:divide-y-0 md:divide-x rtl:md:divide-x-reverse divide-border grid grid-cols-1 md:grid-cols-3 shadow-xs">
          {certs.map((cert) => {
            const Icon = cert.icon;

            return (
              <div
                key={cert.key}
                className="group p-6 sm:p-8 space-y-4 transition-colors hover:bg-muted/20 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Standard Header */}
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="inline-flex items-center gap-2">
                      <Icon className="h-4 w-4 text-foreground" aria-hidden="true" />
                      <span className="font-mono text-xs sm:text-sm font-bold text-foreground">
                        {cert.standard}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1 text-[11px] font-mono rtl:font-sans text-muted-foreground">
                      <ShieldCheck className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
                      <span>{t('aboutPage.verifyCert')}</span>
                    </div>
                  </div>

                  {/* Standard Name */}
                  <h3 className="font-heading text-base sm:text-lg font-bold text-foreground tracking-tight">
                    {cert.name}
                  </h3>

                  {/* Standard Description */}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {cert.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
