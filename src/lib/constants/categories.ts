export interface CategoryDef {
  slug: string;
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}

export const CATEGORIES: CategoryDef[] = [
  {
    slug: 'recipe',
    label: 'レシピ',
    color: '#D85A30',
    bgColor: 'bg-[#D85A30]',
    icon: '🔥',
  },
  {
    slug: 'opening',
    label: '開店',
    color: '#0F6E56',
    bgColor: 'bg-[#0F6E56]',
    icon: '🕐',
  },
  {
    slug: 'closing',
    label: '閉店',
    color: '#534AB7',
    bgColor: 'bg-[#534AB7]',
    icon: '🔔',
  },
  {
    slug: 'cleaning',
    label: '清掃',
    color: '#185FA5',
    bgColor: 'bg-[#185FA5]',
    icon: '📋',
  },
  {
    slug: 'service',
    label: '接客',
    color: '#993556',
    bgColor: 'bg-[#993556]',
    icon: '👤',
  },
  {
    slug: 'locations',
    label: '場所',
    color: '#854F0B',
    bgColor: 'bg-[#854F0B]',
    icon: '🖥',
  },
];

export function getCategoryDef(slug: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export const CATEGORY_SLUGS = [
  'recipe',
  'opening',
  'closing',
  'cleaning',
  'service',
  'other',
] as const;
