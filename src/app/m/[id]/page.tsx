import { AppLayout } from '@/components/layout/AppLayout';
import { ContentHeader } from '@/components/content/ContentHeader';
import { BlockRenderer } from '@/components/content/BlockRenderer';
import { RelatedContents } from '@/components/content/RelatedContents';
import { ItemBadge } from '@/components/item/ItemBadge';
import { getContentById } from '@/services/supabase/contentService';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ContentDetailPage({ params }: Props) {
  const { id } = await params;

  let data: Awaited<ReturnType<typeof getContentById>> | null = null;
  try {
    data = await getContentById(id);
  } catch {
    notFound();
  }

  if (!data) notFound();

  const blocks = (data.content_blocks ?? []).sort(
    (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
  );

  // Collect all items across all blocks
  const allItems = blocks.flatMap((block: { content_block_items?: { items: { id: string; name: string; locations?: { label: string } } }[] }) =>
    (block.content_block_items ?? []).map((cbi: { items: { id: string; name: string; locations?: { label: string } } }) => ({
      id: cbi.items.id,
      name: cbi.items.name,
      locationLabel: cbi.items.locations?.label,
    }))
  );

  const uniqueItems = Array.from(
    new Map(allItems.map((i: { id: string; name: string; locationLabel?: string }) => [i.id, i])).values()
  );

  return (
    <AppLayout>
      <ContentHeader title={data.title} category={data.category} />

      {uniqueItems.length > 0 && (
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 mb-2">材料・道具</p>
          <div className="flex flex-wrap gap-2">
            {(uniqueItems as { id: string; name: string; locationLabel?: string }[]).map((item) => (
              <ItemBadge key={item.id} name={item.name} locationLabel={item.locationLabel} />
            ))}
          </div>
        </div>
      )}

      <div>
        {blocks.map((block: { id: string; block_type: string; body_html: string | null; media_url: string | null; caution: string | null; sort_order: number }) => (
          <BlockRenderer key={block.id} block={block as Parameters<typeof BlockRenderer>[0]['block']} />
        ))}
      </div>

      <RelatedContents contents={[]} />
    </AppLayout>
  );
}
