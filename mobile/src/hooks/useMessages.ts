import { useCallback } from 'react';
import { useMessageStore } from '@/stores';

export function useMessages() {
  const store = useMessageStore();

  const loadConversations = useCallback(async () => {
    await store.loadConversations();
  }, [store.loadConversations]);

  const loadMessages = useCallback(
    async (conversationId: string) => {
      await store.loadMessages(conversationId);
    },
    [store.loadMessages],
  );

  const sendMessage = useCallback(
    async (conversationId: string, content: string) => {
      await store.sendMessage(conversationId, content);
    },
    [store.sendMessage],
  );

  const markConversationRead = useCallback(
    async (conversationId: string) => {
      await store.markConversationRead(conversationId);
    },
    [store.markConversationRead],
  );

  return {
    conversations: store.conversations,
    activeChat: store.activeChat,
    messages: store.messages,
    unreadCount: store.unreadCount,
    loadConversations,
    loadMessages,
    sendMessage,
    setActiveChat: store.setActiveChat,
    markConversationRead,
    addIncomingMessage: store.addIncomingMessage,
  };
}
