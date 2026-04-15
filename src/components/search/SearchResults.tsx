import Link from 'next/link';
import type { Content } from '@/lib/types/content';
import { getCategoryDef } from '@/lib/constants/categories';
import { formatRelativeTime } from '@/lib/helpers/dateFormatter';

interface SearchResultsProps {
  contents: Content[];
}

export function SearchResults({ contents }: SearchResultsProps) {
  if (contents.length === 0) return null;

  return (
    <div>
      {contents.map((c) => {
        const def = getCategoryDef(c.category);
        return (
          <Link
            key={c.id}
            href={`/m/${c.id}`}
            className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
          >
            <span
              className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
              style={{ backgroundColor: def?.color ?? '#666' }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900 truncate">{c.title}</p>
              <p className="text-xs text-gray-500 truncate">
                {def?.label ?? c.category} — {c.summary}
              </p>
            </div>
            <span className="text-xs text-gray-400">{formatRelativeTime(c.updated_at)}</span>
          </Link>
        );
      })}
    </div>
  );
}
