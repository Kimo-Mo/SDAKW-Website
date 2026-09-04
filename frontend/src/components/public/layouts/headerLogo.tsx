import { Link } from '@/i18n/navigation';
import Image from 'next/image';

const HeaderLogo = () => {
  return (
    <Link
      href="/"
      className="relative flex items-center justify-center h-full group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
      {/* Curved Hanging Apron Shape (Desktop only */}
      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-300 hidden lg:block opacity-0 -translate-y-2 lg:opacity-100 lg:translate-y-0
        `}
        aria-hidden="true">
        <svg
          width="280"
          height="48"
          viewBox="0 0 280 48"
          className="w-60 h-10 -mt-px drop-shadow-[0_4px_6px_rgba(0,0,0,0.06)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 0,0 
               C 26,0 32,48 58,48 
               L 222,48 
               C 248,48 254,0 280,0 
               Z"
            className="fill-background"
          />
        </svg>
      </div>

      {/* Logo container */}
      <div
        className={`relative flex items-center justify-center transition-all duration-300 translate-y-0 lg:translate-y-4 lg:bg-background lg:px-4 lg:pt-2 lg:pb-3`}>
        <Image
          src="/images/sdakw-logo.webp"
          alt="logo"
          width={150}
          height={95}
          className={`object-contain transition-all duration-300 h-14 scale-90 lg:h-22 lg:scale-100 dark:brightness-125 dark:contrast-110 w-auto`}
          priority
        />
      </div>
    </Link>
  );
};

export default HeaderLogo;
