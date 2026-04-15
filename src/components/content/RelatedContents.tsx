import Link from 'next/link';
import type { Content } from '@/lib/types/content';

interface RelatedContentsProps {
  contents: Content[];
}

export function RelatedContents({ contents }: RelatedContentsProps) {
  if (contents.length === 0) return null;
  return (
    <div className="px-4 py-4 border-t border-gray-200 mt-4">
      <h2 className="text-sm font-semibold text-gray-500 mb-2">関連マニュアル</h2>
      <div className="space-y-2">
        {contents.map((c) => (
          <Link key={c.id} href={`/m/${c.id}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
            <span>→</span>
            <span>{c.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
