import { create } from "zustand";
import { mockConversations, mockMessages } from "@/mock";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Conversation {
  id: string;
  participantIds: string[];
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  status: "active" | "archived";
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "file" | "system";
  createdAt: string;
  readAt: string | null;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface MessageState {
  conversations: Conversation[];
  activeConversation: string | null;
  messages: Message[];

  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (conversationId: string | null) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  markConversationRead: (conversationId: string) => void;
  updateConversationLastMessage: (conversationId: string, message: string, timestamp: string) => void;
}

export const useMessageStore = create<MessageState>()((set) => ({
  conversations: mockConversations as Conversation[],
  activeConversation: null,
  messages: mockMessages as Message[],

  setConversations: (conversations) => {
    set({ conversations });
  },

  setActiveConversation: (conversationId) => {
    set({ activeConversation: conversationId });
  },

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  setMessages: (messages) => {
    set({ messages });
  },

  markConversationRead: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c,
      ),
      messages: state.messages.map((m) =>
        m.conversationId === conversationId && !m.readAt
          ? { ...m, readAt: new Date().toISOString() }
          : m,
      ),
    }));
  },

  updateConversationLastMessage: (conversationId, message, timestamp) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: message, lastMessageAt: timestamp }
          : c,
      ),
    }));
  },
}));
