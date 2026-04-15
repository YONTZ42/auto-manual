'use client';

import { CATEGORIES } from '@/lib/constants/categories';

interface CategoryFilterProps {
  active: string;
  onChange: (slug: string) => void;
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  const all = [{ slug: 'all', label: '全て', color: '#666' }, ...CATEGORIES];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
      {all.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => onChange(cat.slug)}
          className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
          style={
            active === cat.slug
              ? { backgroundColor: cat.color, color: 'white' }
              : { backgroundColor: '#f3f4f6', color: '#6b7280' }
          }
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
