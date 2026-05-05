import { create } from 'zustand';
import type { Message, Conversation } from '@/types';
import * as messageApi from '@/services/api/message';

interface MessageState {
  conversations: Conversation[];
  activeChat: string | null;
  messages: Message[];
  unreadCount: number;
}

interface MessageActions {
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  setActiveChat: (conversationId: string | null) => void;
  markConversationRead: (conversationId: string) => Promise<void>;
  addIncomingMessage: (message: Message) => void;
}

type MessageStore = MessageState & MessageActions;

export const useMessageStore = create<MessageStore>((set, get) => ({
  conversations: [],
  activeChat: null,
  messages: [],
  unreadCount: 0,

  loadConversations: async () => {
    try {
      const conversations = await messageApi.getConversations();
      const safeList = Array.isArray(conversations) ? conversations : [];
      const unreadCount = safeList.reduce((sum, c) => sum + (c?.unreadCount || 0), 0);
      set({ conversations: safeList, unreadCount });
    } catch {
      set({ conversations: [], unreadCount: 0 });
    }
  },

  loadMessages: async (conversationId) => {
    try {
      const messages = await messageApi.getMessages(conversationId);
      set({ messages: Array.isArray(messages) ? messages : [] });
    } catch {
      set({ messages: [] });
    }
  },

  sendMessage: async (conversationId, content) => {
    if (!conversationId || !content?.trim()) return;
    try {
      const message = await messageApi.sendMessage(conversationId, content);
      if (!message) return;
      set((state) => ({
        messages: [...state.messages, message],
        conversations: state.conversations.map((c) =>
          c.id === conversationId
            ? { ...c, lastMessage: message, updatedAt: message.timestamp ?? new Date().toISOString() }
            : c,
        ),
      }));
    } catch (err) {
      console.warn('[messageStore] sendMessage failed:', err);
      throw err;
    }
  },

  setActiveChat: (conversationId) => set({ activeChat: conversationId }),

  markConversationRead: async (conversationId) => {
    if (!conversationId) return;
    set((state) => {
      const conv = state.conversations.find((c) => c.id === conversationId);
      const readCount = conv?.unreadCount ?? 0;
      return {
        conversations: state.conversations.map((c) =>
          c.id === conversationId ? { ...c, unreadCount: 0 } : c,
        ),
        messages: state.messages.map((m) => ({ ...m, read: true })),
        unreadCount: Math.max(0, state.unreadCount - readCount),
      };
    });
    try {
      await messageApi.markConversationRead(conversationId);
    } catch {
      // Backend hiccup — UI already updated
    }
  },

  addIncomingMessage: (message) =>
    set((state) => {
      const raw = message as Record<string, unknown>
      const senderId = (message?.senderId ?? (raw?.sender_id as string)) || ''
      const conversationId = ((raw?.conversation_id as string) ?? (raw?.conversationId as string)) || ''
      if (!senderId && !conversationId) return state

      const matches = (c: Record<string, unknown>): boolean => {
        if (conversationId && c?.id === conversationId) return true
        const other = (c?.other_user_id as string) || (c?.otherUserId as string) || ''
        if (senderId && other && other === senderId) return true
        const participants = c?.participants
        if (Array.isArray(participants) && senderId && participants.includes(senderId)) return true
        return false
      }

      const targetConv = state.conversations.find((c) => matches(c as unknown as Record<string, unknown>))
      const isActiveChat = !!targetConv && state.activeChat === targetConv.id

      return {
        messages: isActiveChat ? [...state.messages, message] : state.messages,
        conversations: state.conversations.map((c) =>
          matches(c as unknown as Record<string, unknown>)
            ? {
                ...c,
                lastMessage: message,
                unreadCount: isActiveChat ? (c.unreadCount || 0) : (c.unreadCount || 0) + 1,
                updatedAt: message.timestamp,
              }
            : c,
        ),
        unreadCount: isActiveChat ? state.unreadCount : state.unreadCount + 1,
      };
    }),
}));
