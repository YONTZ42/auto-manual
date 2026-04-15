'use client';

import { useState, useEffect } from 'react';
import { StatCards } from '@/components/owner/StatCards';
import { CreateButton } from '@/components/owner/CreateButton';
import { CategoryFilter } from '@/components/owner/CategoryFilter';
import { ContentManageCard } from '@/components/owner/ContentManageCard';
import Link from 'next/link';
import type { Content } from '@/lib/types/content';

export default function OwnerDashboard() {
  const [contents, setContents] = useState<Content[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((data) => setContents(data.data ?? []))
      .catch(() => {});
  }, []);

  const filtered =
    activeCategory === 'all'
      ? contents
      : contents.filter((c) => c.category === activeCategory);

  return (
    <div>
      <StatCards contents={contents} />
      <CreateButton />
      <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      {filtered.map((c) => (
        <ContentManageCard key={c.id} content={c} />
      ))}
      {filtered.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-8">コンテンツがありません</p>
      )}
      <div className="border-t border-gray-200 mt-6 pt-4">
        <Link
          href="/owner/locations"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <span>📍</span>
          <span>配置管理 →</span>
        </Link>
      </div>
    </div>
  );
}
