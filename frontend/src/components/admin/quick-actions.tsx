'use client';

import { useTranslations } from 'next-intl';
import { PlusCircle, FolderKanban, Globe, ArrowUpRight } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { Card, CardContent } from '@/components/ui/card';

export function AdminQuickActions() {
  const t = useTranslations('admin');

  const actions = [
    {
      id: 'add-project',
      title: t('quickActions.addProjectTitle'),
      description: t('quickActions.addProjectDesc'),
      href: '/admin/projects/new',
      icon: PlusCircle,
      isExternal: false,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      id: 'manage-projects',
      title: t('quickActions.manageProjectsTitle'),
      description: t('quickActions.manageProjectsDesc'),
      href: '/admin/projects',
      icon: FolderKanban,
      isExternal: false,
      color: 'text-sky-600 dark:text-sky-400',
      bgColor: 'bg-sky-500/10',
    },
    {
      id: 'preview-site',
      title: t('quickActions.previewSiteTitle'),
      description: t('quickActions.previewSiteDesc'),
      href: '/',
      icon: Globe,
      isExternal: true,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="space-y-4 pt-4">
      <div>
        <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
          {t('quickActions.title')}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">{t('quickActions.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          if (action.isExternal) {
            return (
              <a
                key={action.id}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block">
                <Card className="h-full border border-border/70 hover:border-primary/50 transition-all hover:shadow-md cursor-pointer">
                  <CardContent className="flex items-start justify-between p-5">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${action.bgColor}`}>
                        <Icon className={`h-5 w-5 ${action.color}`} />
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                          {action.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ms-2 rtl:-scale-x-100" />
                  </CardContent>
                </Card>
              </a>
            );
          }

          return (
            <Link key={action.id} href={action.href} className="group block">
              <Card className="h-full border border-border/70 hover:border-primary/50 transition-all hover:shadow-md cursor-pointer">
                <CardContent className="flex items-start justify-between p-5">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${action.bgColor}`}>
                      <Icon className={`h-5 w-5 ${action.color}`} />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                        {action.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ms-2 rtl:-scale-x-100" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
