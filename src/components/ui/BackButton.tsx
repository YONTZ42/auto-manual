'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  href?: string;
  label?: string;
}

export function BackButton({ href, label = '戻る' }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) router.push(href);
    else router.back();
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm"
    >
      <span>←</span>
      <span>{label}</span>
    </button>
  );
}
