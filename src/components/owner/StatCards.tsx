import type { Content } from '@/lib/types/content';
import { CATEGORIES } from '@/lib/constants/categories';

interface StatCardsProps {
  contents: Content[];
}

export function StatCards({ contents }: StatCardsProps) {
  const total = contents.length;
  const byCat = CATEGORIES.slice(0, 2).map((cat) => ({
    label: cat.label,
    count: contents.filter((c) => c.category === cat.slug).length,
    color: cat.color,
  }));

  return (
    <div className="flex gap-3 mb-6">
      <div className="flex-1 bg-gray-100 rounded-xl p-4 text-center">
        <p className="text-2xl font-bold text-gray-900">{total}</p>
        <p className="text-xs text-gray-500">全体</p>
      </div>
      {byCat.map((c) => (
        <div key={c.label} className="flex-1 rounded-xl p-4 text-center text-white" style={{ backgroundColor: c.color }}>
          <p className="text-2xl font-bold">{c.count}</p>
          <p className="text-xs opacity-80">{c.label}</p>
        </div>
      ))}
    </div>
  );
}
