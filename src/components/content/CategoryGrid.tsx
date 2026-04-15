import Link from 'next/link';
import { CATEGORIES } from '@/lib/constants/categories';

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-3 gap-3 px-4 py-2">
      {CATEGORIES.map((cat) => {
        const href = cat.slug === 'locations' ? '/locations' : `/c/${cat.slug}`;
        return (
          <Link
            key={cat.slug}
            href={href}
            className="flex flex-col items-center justify-center aspect-square rounded-2xl text-white gap-1"
            style={{ backgroundColor: cat.color }}
          >
            <span className="text-2xl">{cat.icon}</span>
            <span className="text-xs font-medium">{cat.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
