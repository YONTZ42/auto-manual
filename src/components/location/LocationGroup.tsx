import type { Location } from '@/lib/types/location';
import { LocationCard } from './LocationCard';

const AREA_LABELS: Record<string, string> = {
  fridge: '冷蔵・冷凍',
  freezer: '冷蔵・冷凍',
  shelf: '棚・収納',
  counter: '調理スペース',
  storage: '収納',
  other: 'その他',
};

interface LocationGroupProps {
  areaType: string;
  locations: (Location & { items?: unknown[] })[];
}

export function LocationGroup({ areaType, locations }: LocationGroupProps) {
  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-500 px-4 mb-2">
        {AREA_LABELS[areaType] ?? areaType}
      </h2>
      <div className="grid grid-cols-2 gap-3 px-4">
        {locations.map((loc) => (
          <LocationCard key={loc.id} location={loc} />
        ))}
      </div>
    </div>
  );
}
