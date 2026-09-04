import { useTranslations } from 'next-intl';
import { Building2, Layers, Sparkles } from 'lucide-react';
import { Reveal, RevealItem } from '@/components/shared/reveal';

/**
 * Public Home Page Services Overview Section.
 * Showcases SDAKW's 3 core contracting capabilities based on the verified company profile.
 * Restyled with asymmetric editorial staging and monolithic specification panels.
 */
export function ServicesSection() {
  const t = useTranslations('public');

  const services = [
    {
      id: 'service1',
      index: '01',
      title: t('services.service1.title'),
      description: t('services.service1.description'),
      icon: Building2,
      tag: 'STRUCTURE & BUILD',
    },
    {
      id: 'service2',
      index: '02',
      title: t('services.service2.title'),
      description: t('services.service2.description'),
      icon: Layers,
      tag: 'STONE & MARBLE',
    },
    {
      id: 'service3',
      index: '03',
      title: t('services.service3.title'),
      description: t('services.service3.description'),
      icon: Sparkles,
      tag: 'FINISHING & SYSTEMS',
    },
  ];

  return (
    <section className="main_section text-start">
      {/* Section Header with Asymmetric Editorial Staging */}
      <Reveal variant="fade-scale" className="mb-8">
        <div className="space-y-3 max-w-3xl border-b border-border pb-6">
          <div className="text-xs font-mono rtl:font-sans font-semibold tracking-widest rtl:tracking-normal text-muted-foreground uppercase">
            03 // {t('services.badge')}
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
            {t('services.title')}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            {t('services.subtitle')}
          </p>
        </div>
      </Reveal>

      {/* 3 Core Monolithic Specification Panels */}
      <div>
        <Reveal variant="stagger-children" staggerDelay={0.12}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <RevealItem key={service.id}>
                  <div className="group relative flex flex-col justify-between border border-border bg-card p-6 sm:p-8 shadow-xs transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-md hover:border-foreground/40 hover:bg-muted/20 motion-reduce:transform-none text-start h-full space-y-4">
                    <div className="space-y-4">
                      {/* Top Header Bar: Index + Icon */}
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <span className="font-mono text-sm font-bold text-foreground">
                          {service.index}.
                        </span>
                        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                      </div>

                      {/* Service Title */}
                      <h3 className="font-heading text-base sm:text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-foreground">
                        {service.title}
                      </h3>

                      {/* Service Description */}
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
