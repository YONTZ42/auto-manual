import Link from 'next/link';
import Image from 'next/image';
import type { Item } from '@/lib/types/location';

interface ItemCardProps {
  item: Item & { relatedContents?: { id: string; title: string }[] };
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <div className="flex items-start gap-3 p-4 border-b border-gray-100">
      <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
        {item.photo_url ? (
          <Image src={item.photo_url} alt={item.name} width={48} height={48} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-900">{item.name}</p>
        {item.relatedContents?.map((c) => (
          <Link key={c.id} href={`/m/${c.id}`} className="text-xs text-blue-600 hover:underline block">
            関連: {c.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
