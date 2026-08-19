'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { ProjectDetailViewProps } from '@/types/public';
import { ProjectHero } from './project-hero';
import { ProjectMetadataBar } from './project-metadata-bar';
import { ProjectGallery } from './project-gallery';
import { ProjectContractors } from './project-contractors';

/**
 * Public project detail view orchestrator component.
 * Assembles breadcrumbs, hero cover, metadata badges, title, description,
 * gallery, and contractors in a clean stacked single-column layout.
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
      <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Navigation & Breadcrumbs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/40">
          {/* Back to Projects link */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-300 rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1"
              aria-hidden="true"
            />
            <span>{t('projectDetail.breadcrumb.projects')}</span>
          </Link>

          {/* Breadcrumb path */}
          <nav
            aria-label="Breadcrumb"
            className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
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
              className="font-medium text-foreground truncate max-w-50 sm:max-w-xs"
              title={localizedTitle}>
              {localizedTitle}
            </span>
          </nav>
        </div>

        {/* 1. Hero Cover Image */}
        <ProjectHero coverImage={project.coverImage} title={localizedTitle} locale={locale} />

        {/* 2. Metadata Bar */}
        <ProjectMetadataBar project={project} locale={locale} />

        {/* 3. Title & Description Section */}
        <div className="space-y-6 sm:space-y-8">
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
            {localizedTitle}
          </h1>

          {/* Description Section */}
          {localizedDescription && (
            <section className="space-y-3 rounded-2xl bg-card border border-border/60 p-6 sm:p-8 shadow-xs">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('projectDetail.sections.description')}
              </h2>
              <div className="text-base sm:text-lg text-foreground/90 leading-relaxed sm:leading-8 whitespace-pre-line">
                {localizedDescription}
              </div>
            </section>
          )}
        </div>

        {/* 4. Gallery Section (omitted if empty) */}
        {project.gallery && project.gallery.length > 0 && (
          <ProjectGallery images={project.gallery} projectTitle={localizedTitle} locale={locale} />
        )}

        {/* 5. Contractors Section (strictly for government projects) */}
        {project.projectType === 'government' &&
          project.contractors &&
          project.contractors.length > 0 && (
            <ProjectContractors contractors={project.contractors} locale={locale} />
          )}
      </div>
    </article>
  );
}
