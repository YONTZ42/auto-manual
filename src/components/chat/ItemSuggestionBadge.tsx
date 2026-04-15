import type { DetectedItem } from '@/lib/types/chat';

interface ItemSuggestionBadgeProps {
  item: DetectedItem;
}

export function ItemSuggestionBadge({ item }: ItemSuggestionBadgeProps) {
  if (item.isNew) {
    return (
      <span className="inline-flex items-center gap-1 bg-red-50 border border-red-300 text-red-700 text-xs px-2 py-0.5 rounded-full">
        {item.name} - 未登録
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 bg-yellow-50 border border-yellow-300 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
      {item.name} - {item.locationLabel ?? '場所不明'}
    </span>
  );
}
