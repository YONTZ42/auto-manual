import Link from 'next/link';
import type { Content } from '@/lib/types/content';
import { getCategoryDef } from '@/lib/constants/categories';
import { formatRelativeTime } from '@/lib/helpers/dateFormatter';

interface ContentCardProps {
  content: Content;
}

export function ContentCard({ content }: ContentCardProps) {
  const def = getCategoryDef(content.category);
  return (
    <Link
      href={`/m/${content.id}`}
      className="block mx-4 mb-3 rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-1" style={{ backgroundColor: def?.color ?? '#666' }} />
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{content.title}</h3>
        {content.summary && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{content.summary}</p>
        )}
        <p className="text-xs text-gray-400 mt-2">更新: {formatRelativeTime(content.updated_at)}</p>
      </div>
    </Link>
  );
}
