import { AppLayout } from '@/components/layout/AppLayout';
import { SearchBar } from '@/components/search/SearchBar';
import { CategoryGrid } from '@/components/content/CategoryGrid';
import { RecentList } from '@/components/content/RecentList';
import { getRecentContents } from '@/services/supabase/contentService';

export default async function HomePage() {
  let recentContents: Awaited<ReturnType<typeof getRecentContents>> = [];

  try {
    recentContents = await getRecentContents(10);
  } catch {
    // Supabase未設定時はスキップ
  }

  return (
    <AppLayout>
      <SearchBar />
      <CategoryGrid />
      <div className="h-px bg-gray-100 mx-4 my-2" />
      {recentContents.length > 0 ? (
        <RecentList contents={recentContents} />
      ) : (
        <div className="px-4 py-4">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">最近追加</h2>
          <p className="text-sm text-gray-400">まだコンテンツがありません</p>
        </div>
      )}
    </AppLayout>
  );
}
