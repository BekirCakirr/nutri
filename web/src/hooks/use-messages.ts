import { useCallback, useState } from "react";
import { useMessageStore } from "@/stores/message-store";
import type { Message } from "@/stores/message-store";
import { mockMessages, simulateApiCall } from "@/mock";

/**
 * Messaging operations hook.
 * Wraps the message store with async loading simulation.
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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeMessages = messages.filter(
    (m) => m.conversationId === activeConversation,
  );

  const totalUnread = conversations.reduce(
    (sum, c) => sum + c.unreadCount,
    0,
  );

  const fetchMessages = useCallback(
    async (conversationId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const all = await simulateApiCall(mockMessages, 500);
        const filtered = all.filter((m) => m.conversationId === conversationId);
        setMessages(filtered as unknown as Message[]);
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
        const newMessage: Message = {
          id: `msg_${Date.now()}`,
          conversationId,
          senderId: "usr_001",
          content,
          type: "text",
          createdAt: new Date().toISOString(),
          readAt: null,
        };
        await simulateApiCall(newMessage, 300);
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
    fetchMessages,
    sendMessage,
    openConversation,
    closeConversation,
    markConversationRead,
  };
}
