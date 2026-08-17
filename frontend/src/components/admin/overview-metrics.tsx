'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { FolderKanban, CheckCircle2, Clock, CheckCheck, Plus, RefreshCw } from 'lucide-react';

import { getAdminProjectSummary } from '@/lib/api/projects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button, buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export function OverviewMetrics() {
  const t = useTranslations('admin');

  const {
    data: summary,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['admin', 'projects', 'summary'],
    queryFn: getAdminProjectSummary,
    staleTime: 30_000, // 30 seconds fresh cache
  });

  const metricsConfig = [
    {
      id: 'total',
      title: t('metrics.total'),
      count: summary?.total ?? 0,
      icon: FolderKanban,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
    },
    {
      id: 'published',
      title: t('metrics.published'),
      count: summary?.published ?? 0,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      id: 'ongoing',
      title: t('metrics.ongoing'),
      count: summary?.ongoing ?? 0,
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
    {
      id: 'completed',
      title: t('metrics.completed'),
      count: summary?.completed ?? 0,
      icon: CheckCheck,
      color: 'text-sky-600 dark:text-sky-400',
      bgColor: 'bg-sky-500/10',
      borderColor: 'border-sky-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t('overview.title')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{t('overview.subtitle')}</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="self-start sm:self-auto gap-2 text-xs">
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          <span>{t('overview.retry')}</span>
        </Button>
      </div>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border border-border/60 shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-9 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        /* Isolated Error State */
        <Card className="border-destructive/30 bg-destructive/5 shadow-xs">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <p className="text-sm font-semibold text-destructive mb-1">
              {t('overview.errorTitle')}
            </p>
            <p className="text-xs text-muted-foreground max-w-md mb-4">
              {t('overview.errorDescription')}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="gap-2 border-destructive/30 hover:bg-destructive/10 text-destructive">
              <RefreshCw className="h-3.5 w-3.5" />
              {t('overview.retry')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Success Metrics Grid */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metricsConfig.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card
                key={metric.id}
                className={`border ${metric.borderColor} shadow-xs hover:shadow-md transition-shadow`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${metric.bgColor}`}>
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {metric.count}
                  </div>
                  <Link
                    href="/admin/projects"
                    className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mt-1 transition-colors">
                    <span>{t('metrics.viewDetails')}</span>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State Banner (if portfolio has 0 projects) */}
      {!isLoading && !isError && summary?.total === 0 && (
        <Card className="border-dashed border-border/80 bg-card shadow-xs">
          <CardContent className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3">
              <FolderKanban className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-base text-foreground mb-1">
              {t('overview.emptyTitle')}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mb-5">
              {t('overview.emptyDescription')}
            </p>
            <Link
              href="/admin/projects/new"
              className={buttonVariants({ size: 'sm', className: 'gap-2' })}>
              <Plus className="h-4 w-4" />
              <span>{t('overview.createFirstProject')}</span>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
