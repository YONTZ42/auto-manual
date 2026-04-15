'use client';

import { useState, KeyboardEvent } from 'react';
import { VoiceButton } from '@/components/ui/VoiceButton';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 p-3 border-t border-gray-200 bg-white">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="メッセージを入力..."
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none outline-none text-sm bg-gray-100 rounded-xl px-3 py-2 max-h-32"
      />
      <VoiceButton onResult={(text) => setValue((prev) => prev + text)} />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl disabled:opacity-50 hover:bg-blue-700 transition-colors"
      >
        送信
      </button>
    </div>
  );
}
