import type { Content } from '@/lib/types/content';
import { ContentCard } from './ContentCard';
import { EmptyState } from '@/components/ui/EmptyState';

interface ContentListProps {
  contents: Content[];
}

export function ContentList({ contents }: ContentListProps) {
  if (contents.length === 0) {
    return <EmptyState title="コンテンツがありません" icon="📄" />;
  }
  return (
    <div className="py-2">
      {contents.map((c) => (
        <ContentCard key={c.id} content={c} />
      ))}
    </div>
  );
}
