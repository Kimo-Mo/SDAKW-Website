'use client';

import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import MainLogo from '@/components/shared/mainLogo';
import { WhatsappIcon } from '@/components/shared/social-icons';

export function PublicFooter() {
  const t = useTranslations('public');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-card border-t border-border mt-auto">
      {/* Main 4-Column Footer Grid */}
      <div className="main_section pb-12!">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Company Overview */}
          <div className="space-y-4 text-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
              <MainLogo />
              <span className="font-heading font-bold tracking-tight text-lg text-foreground group-hover:text-primary transition-colors">
                {t('brand.shortName')}
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t('footer.aboutCompany')}
            </p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <Clock className="h-4 w-4 text-primary shrink-0" />
              <span>{t('footer.workingHoursValue')}</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4 text-start">
            <h3 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wider">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5">
                  <span>{t('nav.home')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5">
                  <span>{t('nav.about')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5">
                  <span>{t('nav.projects')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5">
                  <span>{t('nav.products')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5">
                  <span>{t('nav.contact')}</span>
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  href="/admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
                  <span>{t('footer.adminPortal')}</span>
                  <ArrowUpRight className="h-3 w-3 rtl:-scale-x-100" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="space-y-4 text-start">
            <h3 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wider">
              {t('footer.contactUs')}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{t('footer.addressValue')}</span>
              </li>
              <li>
                <a
                  href="tel:+96550979575"
                  className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <span dir="ltr">{t('footer.phoneValue')}</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@sdakw.com"
                  className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <span>{t('footer.emailValue')}</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/96550979575"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors">
                  <WhatsappIcon className="h-4 w-4 text-primary shrink-0" />
                  <span>{t('footer.whatsappTitle')}</span>
                  <ArrowUpRight className="h-3 w-3 rtl:-scale-x-100" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Social & Credentials */}
          <div className="space-y-4 text-start">
            <h3 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wider">
              {t('footer.socialTitle')}
            </h3>
            <div className="flex flex-col gap-2.5 text-sm">
              <a
                href="https://linkedin.com/company/sdakw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5">
                <span>LinkedIn</span>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground rtl:scale-x-[-1]" />
              </a>
              <a
                href="https://instagram.com/sdakw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5">
                <span>Instagram</span>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground rtl:scale-x-[-1]" />
              </a>
            </div>

            <div className="pt-2">
              <div className="rounded-xl border border-border/80 bg-muted/40 p-3 flex items-center gap-2.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                <span>{t('brand.name')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright Notice */}
        <div className="border-t border-border pt-8 mt-10 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>{t('footer.copyright', { year: currentYear })}</p>
          <p className="text-xs text-muted-foreground">{t('brand.tagline')}</p>
        </div>
      </div>
    </footer>
  );
}
