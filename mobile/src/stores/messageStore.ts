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
    const conversations = await messageApi.getConversations();
    const unreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
    set({ conversations, unreadCount });
  },

  loadMessages: async (conversationId) => {
    const messages = await messageApi.getMessages(conversationId);
    set({ messages });
  },

  sendMessage: async (conversationId, content) => {
    const message = await messageApi.sendMessage(conversationId, content);
    set((state) => ({
      messages: [...state.messages, message],
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: message, updatedAt: message.timestamp }
          : c,
      ),
    }));
  },

  setActiveChat: (conversationId) => set({ activeChat: conversationId }),

  markConversationRead: async (conversationId) => {
    await messageApi.markConversationRead(conversationId);
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
  },

  addIncomingMessage: (message) =>
    set((state) => {
      const isActiveChat = state.activeChat === state.conversations.find(
        (c) => c.participants.includes(message.senderId),
      )?.id;

      return {
        messages: isActiveChat ? [...state.messages, message] : state.messages,
        conversations: state.conversations.map((c) =>
          c.participants.includes(message.senderId)
            ? {
                ...c,
                lastMessage: message,
                unreadCount: isActiveChat ? c.unreadCount : c.unreadCount + 1,
                updatedAt: message.timestamp,
              }
            : c,
        ),
        unreadCount: isActiveChat ? state.unreadCount : state.unreadCount + 1,
      };
    }),
}));
