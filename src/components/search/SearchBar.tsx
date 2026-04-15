'use client';

import { useRouter } from 'next/navigation';
import { VoiceButton } from '@/components/ui/VoiceButton';

export function SearchBar() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 mx-4 my-3 rounded-xl">
      <span className="text-gray-400">🔍</span>
      <button
        className="flex-1 text-left text-gray-400 text-sm"
        onClick={() => router.push('/search')}
      >
        何をお探しですか？
      </button>
      <VoiceButton
        onResult={(text) => router.push(`/search?q=${encodeURIComponent(text)}`)}
      />
    </div>
  );
}
