import api from "@/lib/axios";

import type { Conversation, Message } from "@/types/message";
export type { Conversation, Message };

interface ApiMessageListResponse {
  messages?: Message[];
  pagination?: unknown;
}

export async function getConversations(): Promise<Conversation[]> {
  const { data } = await api.get("/messages/conversations");
  return (Array.isArray(data) ? data : []) as Conversation[];
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data } = await api.get(`/messages/conversations/${conversationId}/messages`);
  const parsed = data as ApiMessageListResponse;
  const messages = Array.isArray(data) ? (data as Message[]) : (parsed.messages ?? []);
  return messages;
}

export async function sendMessage(conversationId: string, content: string): Promise<Message> {
  const { data } = await api.post("/messages/send", { conversationId, content, messageType: "text" });
  return data as Message;
}

export async function markAsRead(conversationId: string): Promise<{ success: boolean }> {
  await api.patch(`/messages/conversations/${conversationId}/read`);
  return { success: true };
}
