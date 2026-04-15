import Image from 'next/image';

interface ImageBlockProps {
  url: string;
  caption?: string | null;
}

export function ImageBlock({ url, caption }: ImageBlockProps) {
  return (
    <div className="px-4 py-2">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
        <Image src={url} alt={caption ?? ''} fill className="object-cover" />
      </div>
      {caption && <p className="text-xs text-gray-500 mt-1 text-center">{caption}</p>}
    </div>
  );
}
