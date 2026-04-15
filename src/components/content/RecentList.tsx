import Link from 'next/link';
import type { Content } from '@/lib/types/content';
import { getCategoryDef } from '@/lib/constants/categories';
import { formatRelativeTime } from '@/lib/helpers/dateFormatter';

interface RecentListProps {
  contents: Content[];
}

export function RecentList({ contents }: RecentListProps) {
  return (
    <div className="px-4 py-2">
      <h2 className="text-sm font-semibold text-gray-500 mb-2">最近追加</h2>
      <div className="space-y-0">
        {contents.map((c) => {
          const def = getCategoryDef(c.category);
          return (
            <Link
              key={c.id}
              href={`/m/${c.id}`}
              className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0"
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: def?.color ?? '#666' }}
              />
              <span className="flex-1 text-sm text-gray-900 truncate">{c.title}</span>
              <span
                className="text-xs px-1.5 py-0.5 rounded text-white flex-shrink-0"
                style={{ backgroundColor: def?.color ?? '#666' }}
              >
                {def?.label ?? c.category}
              </span>
              <span className="text-xs text-gray-400 flex-shrink-0">
                {formatRelativeTime(c.updated_at)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
