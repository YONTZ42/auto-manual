'use client';

import { useEffect } from 'react';
import { BackButton } from '@/components/ui/BackButton';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { ChatInput } from '@/components/chat/ChatInput';
import { useChatSession } from '@/features/chat/useChatSession';
import { useChatStore } from '@/features/chat/chatStore';

export default function CreatePage() {
  const { messages, isStreaming, sendMessage } = useChatSession();
  const { reset, addMessage } = useChatStore();

  useEffect(() => {
    reset();
    addMessage({
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '何のマニュアルを作りますか？レシピ、開店手順、接客マニュアルなど、自由にお伝えください。',
      timestamp: new Date().toISOString(),
    });
  }, [reset, addMessage]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <BackButton href="/owner" />
        <h1 className="font-semibold text-gray-900">新規作成</h1>
        <div className="w-8" />
      </div>
      <ChatContainer messages={messages} isStreaming={isStreaming} />
      <ChatInput onSend={sendMessage} disabled={isStreaming} />
    </div>
  );
}
