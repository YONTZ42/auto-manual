import { create } from 'zustand';
import type { ChatMessage, GeneratedContent, ChatPhase } from '@/lib/types/chat';

interface ChatState {
  messages: ChatMessage[];
  generatedContent: GeneratedContent | null;
  phase: ChatPhase;
  isStreaming: boolean;
  addMessage: (msg: ChatMessage) => void;
  setStreaming: (val: boolean) => void;
  setPhase: (phase: ChatPhase) => void;
  setGeneratedContent: (content: GeneratedContent) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  generatedContent: null,
  phase: 'topic',
  isStreaming: false,
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setStreaming: (val) => set({ isStreaming: val }),
  setPhase: (phase) => set({ phase }),
  setGeneratedContent: (content) => set({ generatedContent: content }),
  reset: () =>
    set({ messages: [], generatedContent: null, phase: 'topic', isStreaming: false }),
}));
