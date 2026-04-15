'use client';

import { useCallback } from 'react';
import { useChatStore } from './chatStore';
import type { ChatMessage } from '@/lib/types/chat';

export function useChatSession() {
  const { messages, isStreaming, addMessage, setStreaming } = useChatStore();

  const sendMessage = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      };
      addMessage(userMsg);
      setStreaming(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })) }),
        });

        if (!res.ok || !res.body) throw new Error('API error');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        const aiMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: '',
          timestamp: new Date().toISOString(),
        };
        addMessage(aiMsg);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });

          // Update last message
          useChatStore.setState((s) => ({
            messages: s.messages.map((m) =>
              m.id === aiMsg.id ? { ...m, content: accumulated } : m
            ),
          }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setStreaming(false);
      }
    },
    [messages, addMessage, setStreaming]
  );

  return { messages, isStreaming, sendMessage };
}
