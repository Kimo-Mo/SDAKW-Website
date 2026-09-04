import Image from 'next/image';

const MainLogo = () => {
  return (
    <div className="relative flex items-center justify-center rounded-lg p-1 dark:bg-[#FAF8F5] dark:border dark:border-[#E5DFD6]/60 transition-colors">
      <Image
        src="/images/sdakw-logo.webp"
        alt="logo"
        width={80}
        height={54}
        className="object-contain h-10 w-auto"
        priority
      />
    </div>
  );
};

export default MainLogo;
