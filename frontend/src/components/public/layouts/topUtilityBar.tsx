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
            className="flex items-center gap-2 text-sm font-medium hover:text-secondary transition-colors">
            <Phone className="h-4 w-4 text-accent dark:text-primary" />
            <span>{t('nav.phoneValue')}</span>
          </Link>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="mailto:info@sdakw.com"
            className="flex items-center gap-2 text-sm font-medium hover:text-secondary transition-colors">
            <Mail className="h-4 w-4 text-accent dark:text-primary" />
            <span>{t('nav.emailValue')}</span>
          </Link>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://maps.app.goo.gl/BEALDg5fUmUjRZVi7"
            className="flex items-center gap-2 text-sm font-medium hover:text-secondary transition-colors">
            <MapPin className="h-4 w-4 text-accent dark:text-primary" />
            <span>{t('nav.addressValue')}</span>
          </Link>
        </div>
        {/* social icons */}
        <div className="flex items-center gap-2">
          <Link
            href="https://linkedin.com/company/sdakw"
            className="flex items-center gap-2 text-sm font-medium hover:text-secondary transition-colors">
            <LinkedinIcon className="h-4 w-4 text-accent dark:text-primary" />
          </Link>
          <Link
            href="https://instagram.com/sdakw"
            className="flex items-center gap-2 text-sm font-medium hover:text-secondary transition-colors">
            <InstagramIcon className="h-4 w-4 text-accent dark:text-primary" />
          </Link>
          <Link
            href="https://facebook.com/sdakw"
            className="flex items-center gap-2 text-sm font-medium hover:text-secondary transition-colors">
            <FacebookIcon className="h-4 w-4 text-accent dark:text-primary" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopUtilityBar;
