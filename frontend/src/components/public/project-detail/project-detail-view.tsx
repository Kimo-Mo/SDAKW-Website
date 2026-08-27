'use client';

import { useTranslations } from 'next-intl';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Reveal } from '@/components/shared/reveal';
import { Separator } from '@/components/ui/separator';
import type { ProjectDetailViewProps } from '@/types/public';
import { ProjectHero } from './project-hero';
import { ProjectMetadataBar } from './project-metadata-bar';
import { ProjectGallery } from './project-gallery';
import { ProjectContractors } from './project-contractors';

/**
 * Public project detail view orchestrator component.
 * Assembles breadcrumbs, hero cover, metadata badges, title, description,
 * gallery carousel, and contractors in an editorial monolithic layout.
 */
export function ProjectDetailView({ project, locale }: ProjectDetailViewProps) {
  const t = useTranslations('public');

  const localizedTitle =
    locale === 'ar'
      ? project.title?.ar || project.title?.en || ''
      : project.title?.en || project.title?.ar || '';

  const localizedDescription =
    locale === 'ar'
      ? project.description?.ar || project.description?.en || ''
      : project.description?.en || project.description?.ar || '';

  return (
    <article className="w-full py-8 sm:py-12 lg:py-16 text-start">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Navigation & Breadcrumbs Bar */}
        <Reveal variant="fade-scale">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-border">
            {/* Back to Projects link */}
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-xs font-mono rtl:font-sans uppercase tracking-wider rtl:tracking-normal font-semibold text-muted-foreground hover:text-foreground transition-colors group">
              <ArrowLeft
                className="h-3.5 w-3.5 transition-transform duration-300 rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1"
                aria-hidden="true"
              />
              <span>{t('projectDetail.breadcrumb.projects')}</span>
            </Link>

            {/* Breadcrumb path */}
            <nav
              aria-label="Breadcrumb"
              className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                {t('nav.home')}
              </Link>
              <ChevronRight
                className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 rtl:rotate-180"
                aria-hidden="true"
              />
              <Link href="/projects" className="hover:text-foreground transition-colors">
                {t('nav.projects')}
              </Link>
              <ChevronRight
                className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 rtl:rotate-180"
                aria-hidden="true"
              />
              <span
                className="font-semibold text-foreground truncate max-w-50 sm:max-w-xs"
                title={localizedTitle}>
                {localizedTitle}
              </span>
            </nav>
          </div>
        </Reveal>

        {/* 1. Hero Cover Image */}
        <Reveal variant="fade-scale">
          <ProjectHero coverImage={project.coverImage} title={localizedTitle} locale={locale} />
        </Reveal>

        {/* 2. Metadata Bar */}
        <Reveal variant="fade-up" delay={0.08}>
          <ProjectMetadataBar project={project} locale={locale} />
        </Reveal>

        {/* 3. Title & Description Section */}
        <div className="space-y-6 sm:space-y-8">
          <Reveal variant="fade-up" delay={0.05}>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {localizedTitle}
            </h1>
          </Reveal>

          {/* Description Section */}
          {localizedDescription && (
            <Reveal variant="fade-scale">
              <section className="space-y-4 bg-card border border-border p-6 sm:p-8 shadow-xs">
                <div className="text-xs font-mono rtl:font-sans font-semibold tracking-widest rtl:tracking-normal text-muted-foreground uppercase border-b border-border pb-2.5">
                  {t('projectDetail.sections.overviewKicker')} <span aria-hidden="true">{'//'}</span>{' '}
                  {t('projectDetail.sections.description')}
                </div>
                <div className="text-base sm:text-lg text-foreground/90 leading-relaxed sm:leading-8 whitespace-pre-line">
                  {localizedDescription}
                </div>
              </section>
            </Reveal>
          )}
        </div>

        {/* 4. Gallery Carousel Section (omitted if empty) */}
        {project.gallery && project.gallery.length > 0 && (
          <>
            <Separator className="bg-border" />
            <ProjectGallery images={project.gallery} projectTitle={localizedTitle} locale={locale} />
          </>
        )}

        {/* 5. Contractors Section (strictly for government projects) */}
        {project.projectType === 'government' &&
          project.contractors &&
          project.contractors.length > 0 && (
            <>
              <Separator className="bg-border" />
              <ProjectContractors contractors={project.contractors} locale={locale} />
            </>
          )}
      </div>
    </article>
  );
}
