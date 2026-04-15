import type { ContentBlock, Category } from './content';

export type ChatPhase =
  | 'topic'
  | 'materials'
  | 'steps'
  | 'caution'
  | 'review';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  detectedItems?: DetectedItem[];
  timestamp: string;
}

export interface DetectedItem {
  name: string;
  locationId?: string;
  locationLabel?: string;
  isNew: boolean;
}

export interface GeneratedContent {
  title: string;
  category: Category;
  blocks: ContentBlock[];
  detectedItems: DetectedItem[];
}
