import Link from 'next/link';
import type { Content } from '@/lib/types/content';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeTime } from '@/lib/helpers/dateFormatter';

interface ContentManageCardProps {
  content: Content;
}

export function ContentManageCard({ content }: ContentManageCardProps) {
  return (
    <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl mb-3">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-900 truncate">{content.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge category={content.category} />
          <span className={`text-xs ${content.is_published ? 'text-green-600' : 'text-gray-400'}`}>
            {content.is_published ? '公開中' : '非公開'}
          </span>
          <span className="text-xs text-gray-400">{formatRelativeTime(content.updated_at)}</span>
        </div>
      </div>
      <Link
        href={`/owner/edit/${content.id}`}
        className="flex-shrink-0 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
      >
        編集
      </Link>
    </div>
  );
}
