import type { BlockType } from '@/lib/types/content';

export const BLOCK_TYPES: { value: BlockType; label: string }[] = [
  { value: 'text', label: 'テキスト' },
  { value: 'image', label: '画像' },
  { value: 'caution', label: '注意' },
  { value: 'video', label: '動画' },
  { value: 'embed', label: '埋め込み' },
];
