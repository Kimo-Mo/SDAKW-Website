export interface PartnerItem {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  logoSrc: string;
}

export const PARTNERS_LIST: PartnerItem[] = [
  {
    id: 'pahw',
    name: {
      en: 'Public Authority for Housing Welfare',
      ar: 'المؤسسة العامة للرعاية السكنية',
    },
    logoSrc: '/images/partners/المؤسسة العامة للرعاية السكنية.webp',
  },
  {
    id: 'mpw',
    name: {
      en: 'Ministry of Public Works',
      ar: 'وزارة الأشغال العامة',
    },
    logoSrc: '/images/partners/وزارة-الاشغال.webp',
  },
  {
    id: 'moe',
    name: {
      en: 'Ministry of Education',
      ar: 'وزارة التربية',
    },
    logoSrc: '/images/partners/وزارة-التربية-الكويت.png',
  },
  {
    id: 'moaia',
    name: {
      en: 'Ministry of Awqaf and Islamic Affairs',
      ar: 'وزارة الاوقاف والشؤون الاسلامية',
    },
    logoSrc: '/images/partners/وزارة الاوقاف.png',
  },
];
