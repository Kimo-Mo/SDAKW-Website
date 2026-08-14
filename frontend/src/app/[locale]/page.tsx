'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { CircleCheckIcon, FileSearchIcon, LanguagesIcon, MoveRightIcon } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import { ErrorState } from '@/components/shared/error-state';
import { LoadingState } from '@/components/shared/loading-state';
import { Pagination } from '@/components/shared/pagination';
import { Link } from '@/i18n/navigation';
import { getAlternateLocale, getLocaleDirection, type Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils/utils';

/**
 * TEMPORARY foundation placeholder — verifies Phase 0 wiring (locale, RTL,
 * TanStack Query provider) and renders every Phase 1 shared component in
 * isolation. Replaced by real pages in later phases.
 */

interface SectionProps {
  title: string;
  children: ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="flex w-full flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
      <h2 className="font-heading text-sm font-medium tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function Row({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-wrap items-center gap-3', className)}>{children}</div>;
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="flex flex-col items-start gap-1.5 text-sm font-medium">{children}</label>
  );
}

export default function FoundationPage() {
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  const probe = useQuery({
    queryKey: ['foundation-probe'],
    queryFn: async () => 'ok',
  });

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 sm:p-6">
      <header className="flex flex-col items-start gap-3">
        <Badge variant="outline">{t('foundation.badge')}</Badge>
        <h1 className="font-heading text-3xl font-medium tracking-tight">
          {t('foundation.title')}
        </h1>
        <p className="text-sm text-muted-foreground">{t('foundation.subtitle')}</p>

        <Row className="gap-4 text-sm">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <LanguagesIcon aria-hidden="true" className="size-4" />
            {t('foundation.localeLabel')}:{' '}
            <span className="font-medium text-foreground">{locale}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <MoveRightIcon aria-hidden="true" className="size-4 rtl:rotate-180" />
            {t('foundation.directionLabel')}:{' '}
            <span className="font-medium text-foreground">
              {getLocaleDirection(locale) === 'rtl'
                ? t('foundation.directionRtl')
                : t('foundation.directionLtr')}
            </span>
          </span>
        </Row>

        <Row>
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <CircleCheckIcon
              aria-hidden="true"
              className={cn(
                'size-4',
                probe.isPending && 'animate-pulse text-muted-foreground/60',
                probe.isSuccess && 'text-emerald-600'
              )}
            />
            {t('foundation.queryLabel')}:{' '}
            <span className="font-medium text-foreground">
              {probe.isPending ? t('foundation.queryChecking') : t('foundation.queryReady')}
            </span>
          </span>
        </Row>

        {/* Locale switch — routed through the i18n layer (never hardcode
            a locale string or use next/link directly). */}
        <Link
          href="/"
          locale={getAlternateLocale(locale)}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline">
          {t('foundation.switchLocale')}
        </Link>
        <Link href="/login" locale={locale}>
          {t('auth.login.title')}
        </Link>
      </header>

      <Section title={t('showcase.components.buttons')}>
        <Row>
          <Button>{t('showcase.buttonDefault')}</Button>
          <Button variant="outline">{t('showcase.variantOutline')}</Button>
          <Button variant="destructive">{t('showcase.variantDestructive')}</Button>
          <Button variant="ghost">{t('showcase.variantGhost')}</Button>
          <Button disabled>
            <Spinner />
            {t('showcase.loadingButton')}
          </Button>
        </Row>
      </Section>

      <Section title={t('showcase.components.forms')}>
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldLabel>
            {t('showcase.inputLabel')}
            <Input placeholder={t('showcase.inputPlaceholder')} className="mt-1" />
          </FieldLabel>
          <FieldLabel>
            {t('showcase.textareaLabel')}
            <Textarea placeholder={t('showcase.textareaPlaceholder')} className="mt-1 min-h-20" />
          </FieldLabel>
        </div>
      </Section>

      <Section title={t('showcase.components.selection')}>
        <Row className="items-end">
          <FieldLabel>
            {t('showcase.selectLabel')}
            <div className="mt-1 w-44">
              <Select defaultValue="one">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one">{t('showcase.selectOptionOne')}</SelectItem>
                  <SelectItem value="two">{t('showcase.selectOptionTwo')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </FieldLabel>
          <FieldLabel>
            <span className="inline-flex items-center gap-2">
              <Checkbox defaultChecked />
              {t('showcase.checkboxLabel')}
            </span>
          </FieldLabel>
          <FieldLabel>
            <span className="inline-flex items-center gap-2">
              <Switch defaultChecked />
              {t('showcase.switchLabel')}
            </span>
          </FieldLabel>
        </Row>
      </Section>

      <Section title={t('showcase.components.overlay')}>
        <Row>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger render={<Button variant="outline" />}>
              {t('showcase.dialogTrigger')}
            </DialogTrigger>
            <DialogContent closeLabel={t('shared.close')}>
              <DialogHeader>
                <DialogTitle>{t('showcase.dialogTitle')}</DialogTitle>
                <DialogDescription>{t('showcase.dialogDescription')}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={() => setDialogOpen(false)}>{t('showcase.dialogClose')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" />}>
              {t('showcase.alertDialogTrigger')}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('showcase.alertDialogTitle')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('showcase.alertDialogDescription')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('showcase.alertDialogCancel')}</AlertDialogCancel>
                <AlertDialogAction>{t('showcase.alertDialogConfirm')}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Row>
      </Section>

      <Section title={t('showcase.components.surface')}>
        <Card>
          <CardHeader>
            <CardTitle>{t('showcase.cardTitle')}</CardTitle>
            <CardDescription>{t('showcase.cardDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Row className="gap-2">
              <Badge>{t('showcase.badgeDefault')}</Badge>
              <Badge variant="secondary">{t('showcase.badgeSecondary')}</Badge>
              <Badge variant="outline">{t('showcase.badgeOutline')}</Badge>
            </Row>
          </CardContent>
          <CardFooter>{t('showcase.cardFooter')}</CardFooter>
        </Card>
      </Section>

      <Section title={t('showcase.components.states')}>
        <div className="flex w-full flex-col gap-4">
          <LoadingState label={t('showcase.loadingLabel')} />

          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">{t('showcase.skeletonLabel')}</span>
            <Row>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-10 w-24" />
            </Row>
          </div>

          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileSearchIcon aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>{t('showcase.emptyTitle')}</EmptyTitle>
            </EmptyHeader>
            <EmptyContent>
              <EmptyDescription>{t('showcase.emptyDescription')}</EmptyDescription>
              <Button variant="outline" size="sm">
                {t('showcase.emptyAction')}
              </Button>
            </EmptyContent>
          </Empty>

          <ErrorState
            title={t('showcase.errorTitle')}
            description={t('showcase.errorDescription')}
            retryLabel={t('showcase.retry')}
            onRetry={() =>
              toast.add({
                type: 'success',
                title: t('showcase.toastTitle'),
                description: t('showcase.toastDescription'),
              })
            }
          />
        </div>
      </Section>

      <Section title={t('showcase.components.feedback')}>
        <Row>
          <Button
            variant="outline"
            onClick={() =>
              toast.add({
                type: 'success',
                title: t('showcase.toastTitle'),
                description: t('showcase.toastDescription'),
              })
            }>
            {t('showcase.toastTrigger')}
          </Button>
        </Row>
      </Section>

      <Section title={t('showcase.paginationLabel')}>
        <Pagination
          currentPage={page}
          totalPages={12}
          onPageChange={setPage}
          previousLabel={t('showcase.previous')}
          nextLabel={t('showcase.next')}
          ariaLabel={t('showcase.paginationLabel')}
        />
      </Section>
    </main>
  );
}
