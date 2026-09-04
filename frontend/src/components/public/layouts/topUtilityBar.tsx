import { FacebookIcon, InstagramIcon, LinkedinIcon } from '@/components/shared/social-icons';
import { Link } from '@/i18n/navigation';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';

const TopUtilityBar = () => {
  const t = useTranslations('public');
  return (
    <div className="w-full hidden lg:block text-white bg-primary dark:bg-background">
      <div className="flex items-center justify-between h-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="tel:+96550979575"
            aria-label={t('nav.phoneAria')}
            className="flex items-center gap-2 text-sm font-medium hover:text-secondary transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:rounded-xs">
            <Phone className="h-4 w-4 text-accent dark:text-primary" aria-hidden="true" />
            <span>{t('nav.phoneValue')}</span>
          </Link>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="mailto:info@sdakw.com"
            aria-label={t('nav.emailAria')}
            className="flex items-center gap-2 text-sm font-medium hover:text-secondary transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:rounded-xs">
            <Mail className="h-4 w-4 text-accent dark:text-primary" aria-hidden="true" />
            <span>{t('nav.emailValue')}</span>
          </Link>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://maps.app.goo.gl/BEALDg5fUmUjRZVi7"
            aria-label={t('nav.addressAria')}
            className="flex items-center gap-2 text-sm font-medium hover:text-secondary transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:rounded-xs">
            <MapPin className="h-4 w-4 text-accent dark:text-primary" aria-hidden="true" />
            <span>{t('nav.addressValue')}</span>
          </Link>
        </div>
        {/* social icons */}
        <div className="flex items-center gap-2">
          <Link
            href="https://linkedin.com/company/sdakw"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('nav.socialLinkedIn')}
            className="p-1 text-sm font-medium hover:text-secondary transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:rounded-xs inline-flex items-center justify-center">
            <LinkedinIcon className="h-4 w-4 text-accent dark:text-primary" aria-hidden="true" />
            <span className="sr-only">{t('nav.socialLinkedIn')}</span>
          </Link>
          <Link
            href="https://instagram.com/sdakw"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('nav.socialInstagram')}
            className="p-1 text-sm font-medium hover:text-secondary transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:rounded-xs inline-flex items-center justify-center">
            <InstagramIcon className="h-4 w-4 text-accent dark:text-primary" aria-hidden="true" />
            <span className="sr-only">{t('nav.socialInstagram')}</span>
          </Link>
          <Link
            href="https://facebook.com/sdakw"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('nav.socialFacebook')}
            className="p-1 text-sm font-medium hover:text-secondary transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:rounded-xs inline-flex items-center justify-center">
            <FacebookIcon className="h-4 w-4 text-accent dark:text-primary" aria-hidden="true" />
            <span className="sr-only">{t('nav.socialFacebook')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopUtilityBar;
