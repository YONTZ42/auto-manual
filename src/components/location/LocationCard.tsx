import Link from 'next/link';
import type { Location } from '@/lib/types/location';

interface LocationCardProps {
  location: Location & { items?: unknown[] };
}

export function LocationCard({ location }: LocationCardProps) {
  const count = location.items?.length ?? 0;
  return (
    <Link
      href={`/locations/${location.id}`}
      className="flex flex-col items-start p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
    >
      <p className="font-medium text-sm text-gray-900">{location.label}</p>
      <p className="text-xs text-gray-500 mt-1">{count}アイテム</p>
    </Link>
  );
}
