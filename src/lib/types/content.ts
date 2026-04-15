export type Category =
  | 'recipe'
  | 'opening'
  | 'closing'
  | 'cleaning'
  | 'service'
  | 'other';

export type BlockType = 'text' | 'image' | 'video' | 'embed' | 'caution';

export interface Content {
  id: string;
  store_id: string;
  title: string;
  category: Category;
  tags: string[];
  summary: string;
  search_text: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentBlock {
  id: string;
  content_id: string;
  sort_order: number;
  block_type: BlockType;
  body_html: string | null;
  media_url: string | null;
  caution: string | null;
  created_at: string;
}
