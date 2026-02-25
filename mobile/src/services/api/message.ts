import type { Message, Conversation } from '@/types';
import { mockMessages, mockConversations } from '@/mock';

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export async function getConversations(): Promise<Conversation[]> {
  await delay();
  return mockConversations;
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  await delay();
  return mockMessages;
}

export async function sendMessage(
  conversationId: string,
  content: string,
  type: 'text' | 'image' | 'file' = 'text',
): Promise<Message> {
  await delay(300);
  return {
    id: 'msg-' + Date.now(),
    senderId: 'user-1',
    receiverId: 'diet-1',
    content,
    type,
    timestamp: new Date().toISOString(),
    read: false,
  };
}

export async function markMessageRead(messageId: string): Promise<void> {
  await delay(200);
}

export async function markConversationRead(conversationId: string): Promise<void> {
  await delay(200);
}
