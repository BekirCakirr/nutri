import { useCallback, useState } from "react";
import { useMessageStore } from "@/stores/message-store";
import type { Message } from "@/stores/message-store";
import {
  getConversations as getConversationsApi,
  getMessages as getMessagesApi,
  sendMessage as sendMessageApi,
  markAsRead,
} from "@/services/message.service";

/**
 * Messaging operations hook.
 * Wraps the message store with real API calls.
 */
export function useMessages() {
  const conversations = useMessageStore((s) => s.conversations);
  const activeConversation = useMessageStore((s) => s.activeConversation);
  const messages = useMessageStore((s) => s.messages);
  const setActiveConversation = useMessageStore((s) => s.setActiveConversation);
  const addMessage = useMessageStore((s) => s.addMessage);
  const setMessages = useMessageStore((s) => s.setMessages);
  const markConversationRead = useMessageStore((s) => s.markConversationRead);
  const updateConversationLastMessage = useMessageStore((s) => s.updateConversationLastMessage);
  const setConversations = useMessageStore((s) => s.setConversations);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeMessages = messages.filter(
    (m) => m.conversationId === activeConversation,
  );

  const totalUnread = conversations.reduce(
    (sum, c) => sum + c.unreadCount,
    0,
  );

  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getConversationsApi();
      setConversations(data as unknown as typeof conversations);
    } catch {
      setError("Failed to fetch conversations");
    } finally {
      setIsLoading(false);
    }
  }, [setConversations]);

  const fetchMessages = useCallback(
    async (conversationId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getMessagesApi(conversationId);
        setMessages(data as unknown as Message[]);
      } catch {
        setError("Failed to fetch messages");
      } finally {
        setIsLoading(false);
      }
    },
    [setMessages],
  );

  const sendMessage = useCallback(
    async (conversationId: string, content: string) => {
      setError(null);
      try {
        const result = await sendMessageApi(conversationId, content);
        const newMessage = result as unknown as Message;
        addMessage(newMessage);
        updateConversationLastMessage(
          conversationId,
          content,
          newMessage.createdAt,
        );
        return newMessage;
      } catch {
        setError("Failed to send message");
        return null;
      }
    },
    [addMessage, updateConversationLastMessage],
  );

  const openConversation = useCallback(
    async (conversationId: string) => {
      setActiveConversation(conversationId);
      await fetchMessages(conversationId);
      markConversationRead(conversationId);
      await markAsRead(conversationId).catch(() => {});
    },
    [setActiveConversation, fetchMessages, markConversationRead],
  );

  const closeConversation = useCallback(() => {
    setActiveConversation(null);
  }, [setActiveConversation]);

  return {
    conversations,
    activeConversation,
    activeMessages,
    messages,
    totalUnread,
    isLoading,
    error,
    fetchConversations,
    fetchMessages,
    sendMessage,
    openConversation,
    closeConversation,
    markConversationRead,
  };
}
