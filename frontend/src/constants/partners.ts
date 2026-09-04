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
    logoSrc: '/images/partners/وزارة-التربية-الكويت.webp',
  },
  {
    id: 'moaia',
    name: {
      en: 'Ministry of Awqaf and Islamic Affairs',
      ar: 'وزارة الأوقاف والشؤون الإسلامية',
    },
    logoSrc: '/images/partners/وزارة الاوقاف.webp',
  },
  {
    id: 'arab-contractors',
    name: {
      en: 'The Arab Contractors',
      ar: 'المقاولون العرب',
    },
    logoSrc: '/images/partners/almokawelon_alarab.webp',
  },
  {
    id: 'canar',
    name: {
      en: 'Canar Trading & Contracting',
      ar: 'شركة كنار للتجارة والمقاولات',
    },
    logoSrc: '/images/partners/canar.webp',
  },
  {
    id: 'first-group',
    name: {
      en: 'First Group for Contracting',
      ar: 'مجموعة فيرست للإنشاءات',
    },
    logoSrc: '/images/partners/first_group.webp',
  },
  {
    id: 'recafco',
    name: {
      en: 'RECAFCO',
      ar: 'شركة ريكافكو',
    },
    logoSrc: '/images/partners/recafco.webp',
  },
  {
    id: 'srbg',
    name: {
      en: 'SRBG',
      ar: 'شركة إس آر بي جي',
    },
    logoSrc: '/images/partners/srpg.webp',
  },
];
