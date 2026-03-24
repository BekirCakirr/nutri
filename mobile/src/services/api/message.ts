import type { Message, Conversation } from '@/types';
import apiClient from './client';

export async function getConversations(): Promise<Conversation[]> {
  const { data } = await apiClient.get('/messages/conversations');
  return (data.data ?? data ?? []) as Conversation[];
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data } = await apiClient.get(`/messages/conversations/${conversationId}/messages`);
  const result = data.data ?? data;
  return (Array.isArray(result) ? result : result?.messages ?? []) as Message[];
}

export async function sendMessage(
  conversationId: string,
  content: string,
  type: 'text' | 'image' | 'file' = 'text',
): Promise<Message> {
  const { data } = await apiClient.post('/messages/send', {
    conversationId,
    content,
    messageType: type,
  });
  return (data.data ?? data) as Message;
}

export async function markMessageRead(messageId: string): Promise<void> {
  // Individual message read — handled via conversation read
  void messageId;
}

export async function markConversationRead(conversationId: string): Promise<void> {
  await apiClient.patch(`/messages/conversations/${conversationId}/read`);
}
