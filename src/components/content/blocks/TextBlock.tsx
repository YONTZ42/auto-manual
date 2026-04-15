'use client';

import { useEffect, useState } from 'react';
import { sanitizeHtml } from '@/lib/sanitize/htmlSanitizer';

interface TextBlockProps {
  html: string;
}

export function TextBlock({ html }: TextBlockProps) {
  const [safe, setSafe] = useState('');

  useEffect(() => {
    sanitizeHtml(html).then(setSafe);
  }, [html]);

  return (
    <div
      className="prose prose-sm max-w-none p-4"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
