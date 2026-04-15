import Link from 'next/link';
import type { Item } from '@/lib/types/location';

interface ItemSearchResultsProps {
  items: Item[];
}

export function ItemSearchResults({ items }: ItemSearchResultsProps) {
  if (items.length === 0) return null;

  return (
    <div>
      <p className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
        アイテムにもヒット
      </p>
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/locations/${item.location_id}`}
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
        >
          <span className="text-lg">📦</span>
          <div>
            <p className="text-sm font-medium text-gray-900">{item.name}</p>
            {item.location && (
              <p className="text-xs text-gray-500">→ {item.location.label}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
