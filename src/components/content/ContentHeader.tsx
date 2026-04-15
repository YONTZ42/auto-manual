import { BackButton } from '@/components/ui/BackButton';
import { Badge } from '@/components/ui/Badge';

interface ContentHeaderProps {
  title: string;
  category: string;
}

export function ContentHeader({ title, category }: ContentHeaderProps) {
  return (
    <div className="px-4 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <BackButton />
        <Badge category={category} />
      </div>
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
    </div>
  );
}
