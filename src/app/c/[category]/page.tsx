import { AppLayout } from '@/components/layout/AppLayout';
import { BackButton } from '@/components/ui/BackButton';
import { ContentList } from '@/components/content/ContentList';
import { getCategoryDef } from '@/lib/constants/categories';
import { getContentsByCategory } from '@/services/supabase/contentService';

interface Props {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const def = getCategoryDef(category);

  let contents: Awaited<ReturnType<typeof getContentsByCategory>> = [];
  try {
    contents = await getContentsByCategory(category);
  } catch {
    // Supabase未設定時はスキップ
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <BackButton href="/" />
        <h1 className="font-semibold text-gray-900">{def?.label ?? category}</h1>
        <div className="w-8" />
      </div>
      <ContentList contents={contents} />
    </AppLayout>
  );
}
