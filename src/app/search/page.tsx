'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { SearchInput } from '@/components/search/SearchInput';
import { SearchResults } from '@/components/search/SearchResults';
import { ItemSearchResults } from '@/components/search/ItemSearchResults';
import { Spinner } from '@/components/ui/Spinner';
import { useSearch } from '@/features/search/useSearch';
import { useState, useEffect } from 'react';
import type { Content } from '@/lib/types/content';
import type { Item } from '@/lib/types/location';

function SearchPageInner() {
  const router = useRouter();
  const { query, handleChange } = useSearch();
  const [contents, setContents] = useState<Content[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setContents([]);
      setItems([]);
      return;
    }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then(({ contents, items }) => {
        setContents(contents ?? []);
        setItems(items ?? []);
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <AppLayout>
      <SearchInput
        value={query}
        onChange={handleChange}
        onBack={() => router.back()}
      />
      {loading && (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      )}
      {!loading && query && contents.length === 0 && items.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-8">
          「{query}」の検索結果がありません
        </p>
      )}
      <SearchResults contents={contents} />
      {items.length > 0 && (
        <>
          <div className="h-px bg-gray-100 mx-4 my-2" />
          <ItemSearchResults items={items} />
        </>
      )}
    </AppLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageInner />
    </Suspense>
  );
}
