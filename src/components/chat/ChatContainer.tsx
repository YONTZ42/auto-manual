'use client';

import { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/lib/types/chat';
import { AiMessage } from './AiMessage';
import { UserMessage } from './UserMessage';
import { ItemSuggestionBadge } from './ItemSuggestionBadge';
import { Spinner } from '@/components/ui/Spinner';

interface ChatContainerProps {
  messages: ChatMessage[];
  isStreaming: boolean;
}

export function ChatContainer({ messages, isStreaming }: ChatContainerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {messages.map((msg) =>
        msg.role === 'assistant' ? (
          <AiMessage key={msg.id} content={msg.content}>
            {msg.detectedItems && msg.detectedItems.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {msg.detectedItems.map((item, i) => (
                  <ItemSuggestionBadge key={i} item={item} />
                ))}
              </div>
            )}
          </AiMessage>
        ) : (
          <UserMessage key={msg.id} content={msg.content} />
        )
      )}
      {isStreaming && (
        <div className="flex gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white text-sm">
            🤖
          </div>
          <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
            <Spinner size="sm" />
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
