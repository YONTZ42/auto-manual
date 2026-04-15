'use client';

const ALLOWED_TAGS = [
  'p', 'h2', 'h3', 'h4', 'strong', 'em', 'u', 's', 'br',
  'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span', 'img', 'video', 'source', 'svg', 'path', 'rect',
  'circle', 'line', 'text', 'g', 'defs', 'marker', 'a',
];

const ALLOWED_ATTR = [
  'class', 'style', 'src', 'alt', 'href', 'width', 'height',
  'viewBox', 'xmlns', 'd', 'fill', 'stroke', 'stroke-width',
  'rx', 'ry', 'cx', 'cy', 'r', 'x', 'y', 'x1', 'y1', 'x2', 'y2',
  'text-anchor', 'dominant-baseline', 'transform',
  'controls', 'autoplay', 'muted', 'loop',
];

export async function sanitizeHtml(html: string): Promise<string> {
  if (typeof window === 'undefined') return html;
  const DOMPurify = (await import('dompurify')).default;
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}
