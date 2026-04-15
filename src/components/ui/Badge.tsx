import { getCategoryDef } from '@/lib/constants/categories';

interface BadgeProps {
  category: string;
  className?: string;
}

export function Badge({ category, className = '' }: BadgeProps) {
  const def = getCategoryDef(category);
  const label = def?.label ?? category;
  const color = def?.color ?? '#666';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white ${className}`}
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}
