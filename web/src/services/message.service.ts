// ---------------------------------------------------------------------------
// Message Service
// ---------------------------------------------------------------------------

import { mockConversations, mockMessages, simulateApiCall } from "@/mock";

type Conversation = (typeof mockConversations)[number];
type Message = (typeof mockMessages)[number];

// ── Public API ───────────────────────────────────────────────────────────────

export async function getConversations(): Promise<Conversation[]> {
  return simulateApiCall([...mockConversations], 300);
}

export async function getMessages(
  conversationId: string,
): Promise<Message[]> {
  const filtered = mockMessages.filter(
    (m) => m.conversationId === conversationId,
  );
  return simulateApiCall(filtered, 300);
}

export async function sendMessage(
  conversationId: string,
  content: string,
): Promise<Message> {
  const newMessage: Message = {
    id: `msg_${Date.now()}`,
    conversationId,
    senderId: "usr_001",
    content,
    type: "text",
    createdAt: new Date().toISOString(),
    readAt: null,
  };
  return simulateApiCall(newMessage, 400);
}

export async function markAsRead(
  conversationId: string,
): Promise<{ success: boolean }> {
  void conversationId;
  return simulateApiCall({ success: true }, 300);
}
