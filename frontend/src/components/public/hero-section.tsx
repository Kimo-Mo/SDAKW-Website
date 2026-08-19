import { useTranslations } from 'next-intl';
import {
  ArrowRight,
  Building2,
  Clock,
  FolderKanban,
  Landmark,
  PhoneCall,
  ShieldCheck,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

/**
 * Public Home Page Hero Section.
 * Renders corporate headline, value proposition, primary CTAs, and 4 trust metric cards.
 */
export function HeroSection() {
  const t = useTranslations('public');

  return (
    <section className="relative w-full overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-28 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-137.5 h-80 bg-primary/10 blur-3xl rounded-full -z-10"
        aria-hidden="true"
      />

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-6 shadow-xs">
        <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{t('hero.badge')}</span>
      </div>

      {/* Flagship Headline */}
      <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-4xl leading-[1.15]">
        {t('hero.title')}
      </h1>

      {/* Subtitle Value Proposition */}
      <p className="mt-6 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
        {t('hero.subtitle')}
      </p>

      {/* Primary Action Buttons */}
      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto">
        <Link href="/projects" className="w-full sm:w-auto">
          <Button
            size="lg"
            className="w-full sm:w-auto rounded-xl px-7 h-12 gap-2 text-sm font-semibold shadow-xs">
            <FolderKanban className="h-4 w-4" aria-hidden="true" />
            <span>{t('hero.exploreProjects')}</span>
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </Button>
        </Link>

        <Link href="/contact" className="w-full sm:w-auto">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto rounded-xl px-7 h-12 gap-2 text-sm font-semibold border-border/80 hover:bg-muted/50">
            <PhoneCall className="h-4 w-4" aria-hidden="true" />
            <span>{t('hero.contactUs')}</span>
          </Button>
        </Link>
      </div>

      {/* 4 Sector Metric Badges Grid */}
      <div className="mt-14 sm:mt-20 w-full grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
        {/* Metric 1: Experience */}
        <div className="group rounded-2xl border border-border bg-card/60 p-4 sm:p-5 backdrop-blur-xs shadow-xs flex flex-col items-center justify-center text-center space-y-1.5 transition-all duration-300 hover:border-primary/30">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-1">
            <Clock className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {t('hero.metrics.experience.value')}
          </span>
          <span className="text-xs text-muted-foreground line-clamp-1">
            {t('hero.metrics.experience.label')}
          </span>
        </div>

        {/* Metric 2: Government */}
        <div className="group rounded-2xl border border-border bg-card/60 p-4 sm:p-5 backdrop-blur-xs shadow-xs flex flex-col items-center justify-center text-center space-y-1.5 transition-all duration-300 hover:border-primary/30">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 mb-1">
            <Landmark className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="font-heading text-base sm:text-lg font-bold tracking-tight text-foreground line-clamp-1">
            {t('hero.metrics.government.value')}
          </span>
          <span className="text-xs text-muted-foreground line-clamp-1">
            {t('hero.metrics.government.label')}
          </span>
        </div>

        {/* Metric 3: Private */}
        <div className="group rounded-2xl border border-border bg-card/60 p-4 sm:p-5 backdrop-blur-xs shadow-xs flex flex-col items-center justify-center text-center space-y-1.5 transition-all duration-300 hover:border-primary/30">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 mb-1">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="font-heading text-base sm:text-lg font-bold tracking-tight text-foreground line-clamp-1">
            {t('hero.metrics.private.value')}
          </span>
          <span className="text-xs text-muted-foreground line-clamp-1">
            {t('hero.metrics.private.label')}
          </span>
        </div>

        {/* Metric 4: ISO */}
        <div className="group rounded-2xl border border-border bg-card/60 p-4 sm:p-5 backdrop-blur-xs shadow-xs flex flex-col items-center justify-center text-center space-y-1.5 transition-all duration-300 hover:border-primary/30">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600/10 text-amber-600 mb-1">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="font-heading text-base sm:text-lg font-bold tracking-tight text-foreground line-clamp-1">
            {t('hero.metrics.iso.value')}
          </span>
          <span className="text-xs text-muted-foreground line-clamp-1">
            {t('hero.metrics.iso.label')}
          </span>
        </div>
      </div>
    </section>
  );
}
