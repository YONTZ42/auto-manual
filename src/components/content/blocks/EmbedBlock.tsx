'use client';

import { useEffect, useState } from 'react';
import { sanitizeHtml } from '@/lib/sanitize/htmlSanitizer';

interface EmbedBlockProps {
  html: string;
}

export function EmbedBlock({ html }: EmbedBlockProps) {
  const [safe, setSafe] = useState('');

  useEffect(() => {
    sanitizeHtml(html).then(setSafe);
  }, [html]);

  return (
    <div
      className="px-4 py-2 overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
