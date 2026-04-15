import { AppLayout } from '@/components/layout/AppLayout';
import { BackButton } from '@/components/ui/BackButton';
import { ItemCard } from '@/components/item/ItemCard';
import { getLocationById } from '@/services/supabase/locationService';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LocationDetailPage({ params }: Props) {
  const { id } = await params;

  let data: Awaited<ReturnType<typeof getLocationById>> | null = null;
  try {
    data = await getLocationById(id);
  } catch {
    notFound();
  }

  if (!data) notFound();

  return (
    <AppLayout>
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <BackButton href="/locations" />
        <h1 className="font-semibold text-gray-900">{data.label}</h1>
        <div className="w-8" />
      </div>
      <div>
        {(data.items ?? []).map((item: { id: string; name: string; photo_url: string | null; notes: string | null; location_id: string; store_id: string; created_at: string }) => (
          <ItemCard key={item.id} item={item} />
        ))}
        {(data.items ?? []).length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">アイテムがありません</p>
        )}
      </div>
    </AppLayout>
  );
}
