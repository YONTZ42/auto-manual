import type { ContentBlock } from '@/lib/types/content';

export function reorderBlocks(
  blocks: ContentBlock[],
  fromIndex: number,
  toIndex: number
): ContentBlock[] {
  const result = [...blocks];
  const [moved] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, moved);
  return result.map((b, i) => ({ ...b, sort_order: i }));
}
