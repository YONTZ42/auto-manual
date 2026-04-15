import type { ContentBlock } from '@/lib/types/content';

export function buildSearchText(blocks: ContentBlock[]): string {
  return blocks
    .map((b) => {
      const parts: string[] = [];
      if (b.body_html) {
        const text = b.body_html.replace(/<[^>]+>/g, ' ').trim();
        parts.push(text);
      }
      if (b.caution) parts.push(b.caution);
      return parts.join(' ');
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
