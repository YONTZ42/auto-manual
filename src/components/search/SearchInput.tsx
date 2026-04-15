'use client';

import { useEffect, useRef } from 'react';
import { VoiceButton } from '@/components/ui/VoiceButton';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onBack: () => void;
}

export function SearchInput({ value, onChange, onBack }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
      <button onClick={onBack} className="text-gray-600">
        ←
      </button>
      <span className="text-gray-400">🔍</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="検索..."
        className="flex-1 outline-none text-sm"
      />
      <VoiceButton onResult={onChange} />
    </div>
  );
}
