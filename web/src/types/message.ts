// ---------------------------------------------------------------------------
// Messaging / Chat Types
// ---------------------------------------------------------------------------

import type { PaginationParams, Timestamps } from "./common";

/** Message content type. */
export enum MessageType {
  Text = "text",
  Image = "image",
  File = "file",
  Audio = "audio",
  Video = "video",
  MealLog = "meal_log",
  PlanUpdate = "plan_update",
  Appointment = "appointment",
  System = "system",
  AiSuggestion = "ai_suggestion",
}

/** Conversation type. */
export type ConversationType = "direct" | "group" | "support" | "ai_assistant";

/** Delivery / read status for a message. */
export type MessageDeliveryStatus = "sending" | "sent" | "delivered" | "read" | "failed";

/** Participant role inside a conversation. */
export type ParticipantRole = "owner" | "admin" | "member" | "observer";

// ── Core entities ──────────────────────────────────────────────────────────

/** A conversation thread. */
export interface Conversation extends Timestamps {
  id: string;
  type: ConversationType;
  title?: string | null;
  imageUrl?: string | null;
  participants: ChatParticipant[];
  lastMessage?: Message | null;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  metadata?: Record<string, unknown>;
}

/** Lightweight conversation for the inbox list. */
export interface ConversationSummary {
  id: string;
  type: ConversationType;
  title?: string | null;
  imageUrl?: string | null;
  participantNames: string[];
  participantAvatars: (string | null)[];
  lastMessagePreview?: string | null;
  lastMessageAt?: string | null;
  lastMessageSenderId?: string | null;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
}

/** A participant in a conversation. */
export interface ChatParticipant {
  id: string;
  userId: string;
  conversationId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl?: string | null;
  role: ParticipantRole;
  isOnline: boolean;
  lastSeenAt?: string | null;
  joinedAt: string;
  mutedUntil?: string | null;
}

/** A single message. */
export interface Message extends Timestamps {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string | null;
  type: MessageType;
  content: string;
  /** Structured payload for non-text types. */
  payload?: MessagePayload | null;
  /** Reply context. */
  replyToId?: string | null;
  replyToPreview?: string | null;
  /** Reactions. */
  reactions: MessageReaction[];
  /** Attachments. */
  attachments: MessageAttachment[];
  /** Delivery. */
  deliveryStatus: MessageDeliveryStatus;
  readBy: MessageReadReceipt[];
  /** Editing. */
  isEdited: boolean;
  editedAt?: string | null;
  isDeleted: boolean;
  deletedAt?: string | null;
}

/** Payload union for rich message types. */
export type MessagePayload =
  | MealLogPayload
  | PlanUpdatePayload
  | AppointmentPayload
  | SystemPayload
  | AiSuggestionPayload;

/** Meal-log message payload. */
export interface MealLogPayload {
  type: "meal_log";
  mealId: string;
  mealType: string;
  calories: number;
  imageUrl?: string;
}

/** Plan-update message payload. */
export interface PlanUpdatePayload {
  type: "plan_update";
  planId: string;
  planTitle: string;
  changeDescription: string;
}

/** Appointment message payload. */
export interface AppointmentPayload {
  type: "appointment";
  appointmentId: string;
  action: "booked" | "rescheduled" | "cancelled" | "reminder";
  scheduledAt: string;
  mode: string;
}

/** System message payload. */
export interface SystemPayload {
  type: "system";
  action: string;
  description: string;
}

/** AI suggestion payload. */
export interface AiSuggestionPayload {
  type: "ai_suggestion";
  suggestionType: string;
  title: string;
  body: string;
  actionUrl?: string;
}

/** File / media attachment. */
export interface MessageAttachment {
  id: string;
  messageId: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string | null;
  width?: number;
  height?: number;
  durationSeconds?: number;
}

/** Emoji reaction on a message. */
export interface MessageReaction {
  emoji: string;
  userId: string;
  userName: string;
  createdAt: string;
}

/** Read receipt. */
export interface MessageReadReceipt {
  userId: string;
  readAt: string;
}

// ── Requests ───────────────────────────────────────────────────────────────

/** Send a new message. */
export interface SendMessageRequest {
  conversationId: string;
  type?: MessageType;
  content: string;
  payload?: MessagePayload;
  replyToId?: string;
  attachmentIds?: string[];
}

/** Edit a message. */
export interface EditMessageRequest {
  messageId: string;
  content: string;
}

/** Create a new conversation. */
export interface CreateConversationRequest {
  type: ConversationType;
  title?: string;
  participantUserIds: string[];
  initialMessage?: string;
}

/** Mark messages as read. */
export interface MarkReadRequest {
  conversationId: string;
  lastReadMessageId: string;
}

/** Message list filters. */
export interface MessageFilters {
  conversationId: string;
  before?: string;
  after?: string;
  types?: MessageType[];
  senderId?: string;
  search?: string;
  pagination: PaginationParams;
}

/** Conversation list filters. */
export interface ConversationFilters {
  search?: string;
  type?: ConversationType[];
  isArchived?: boolean;
  isPinned?: boolean;
  hasUnread?: boolean;
  participantId?: string;
  pagination: PaginationParams;
}

/** Typing indicator event. */
export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
  timestamp: string;
}

/** Real-time message event (WebSocket). */
export interface MessageEvent {
  type:
    | "message:new"
    | "message:updated"
    | "message:deleted"
    | "message:reaction"
    | "conversation:updated"
    | "typing";
  payload: unknown;
  timestamp: string;
}
