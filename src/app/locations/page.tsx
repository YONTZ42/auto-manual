import { AppLayout } from '@/components/layout/AppLayout';
import { BackButton } from '@/components/ui/BackButton';
import { LocationGroup } from '@/components/location/LocationGroup';
import { getLocations } from '@/services/supabase/locationService';
import type { Location } from '@/lib/types/location';

export default async function LocationsPage() {
  let locations: (Location & { items?: unknown[] })[] = [];
  try {
    locations = await getLocations() as (Location & { items?: unknown[] })[];
  } catch {
    // Supabase未設定時はスキップ
  }

  const grouped = locations.reduce<Record<string, (Location & { items?: unknown[] })[]>>((acc, loc) => {
    const key = loc.area_type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(loc);
    return acc;
  }, {});

  return (
    <AppLayout>
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <BackButton href="/" />
        <h1 className="font-semibold text-gray-900">場所から探す</h1>
        <div className="w-8" />
      </div>
      <div className="py-4">
        {Object.entries(grouped).map(([areaType, locs]) => (
          <LocationGroup key={areaType} areaType={areaType} locations={locs} />
        ))}
        {locations.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">場所が登録されていません</p>
        )}
      </div>
    </AppLayout>
  );
}
