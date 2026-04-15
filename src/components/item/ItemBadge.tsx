interface ItemBadgeProps {
  name: string;
  locationLabel?: string;
}

export function ItemBadge({ name, locationLabel }: ItemBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 bg-yellow-50 border border-yellow-300 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
      🏷 {name}
      {locationLabel && <span className="text-yellow-600">{locationLabel}</span>}
    </span>
  );
}
