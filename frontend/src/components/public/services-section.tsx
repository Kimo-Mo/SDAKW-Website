import { useTranslations } from 'next-intl';
import { Building2, Layers, Sparkles } from 'lucide-react';

/**
 * Public Home Page Services Overview Section.
 * Showcases SDAKW's 3 core contracting capabilities based on the verified company profile.
 */
export function ServicesSection() {
  const t = useTranslations('public');

  const services = [
    {
      id: 'service1',
      title: t('services.service1.title'),
      description: t('services.service1.description'),
      icon: Building2,
      accentClass: 'bg-primary/10 text-primary',
    },
    {
      id: 'service2',
      title: t('services.service2.title'),
      description: t('services.service2.description'),
      icon: Layers,
      accentClass: 'bg-blue-600/10 text-blue-600',
    },
    {
      id: 'service3',
      title: t('services.service3.title'),
      description: t('services.service3.description'),
      icon: Sparkles,
      accentClass: 'bg-amber-600/10 text-amber-600',
    },
  ];

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary shadow-xs">
          <Layers className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{t('services.badge')}</span>
        </div>

        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          {t('services.title')}
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
          {t('services.subtitle')}
        </p>
      </div>

      {/* 3 Core Pillars Grid */}
      <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs transition-all duration-300 hover:shadow-md hover:border-primary/40 text-start">
              <div className="space-y-4">
                {/* Icon Box */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${service.accentClass}`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>

                {/* Service Title */}
                <h3 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                  {service.title}
                </h3>

                {/* Service Description */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Decorative bottom accent line */}
              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  SDAKW Specialized
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
