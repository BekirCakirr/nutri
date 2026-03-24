import { useState, useCallback } from "react";
import {
  sendMessage as sendAiMessage,
  getSuggestions,
} from "@/services/ai.service";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AiSuggestion {
  id: string;
  type: "meal_suggestion" | "plan_adjustment" | "health_alert" | "general";
  patientId: string;
  title: string;
  content: string;
  confidence: number;
  createdAt: string;
  status: "pending" | "accepted" | "dismissed";
}

export interface AiChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * AI assistant operations including suggestions and chat.
 */
export function useAi() {
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  const [chatMessages, setChatMessages] = useState<AiChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async (patientId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSuggestions(patientId);
      setSuggestions(data as unknown as AiSuggestion[]);
    } catch {
      setError("Failed to fetch AI suggestions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const acceptSuggestion = useCallback(async (suggestionId: string) => {
    setError(null);
    try {
      // TODO: Backend endpoint for accepting AI suggestions
      setSuggestions((prev) =>
        prev.map((s) =>
          s.id === suggestionId ? { ...s, status: "accepted" as const } : s,
        ),
      );
    } catch {
      setError("Failed to accept suggestion");
    }
  }, []);

  const dismissSuggestion = useCallback(async (suggestionId: string) => {
    setError(null);
    try {
      // TODO: Backend endpoint for dismissing AI suggestions
      setSuggestions((prev) =>
        prev.map((s) =>
          s.id === suggestionId ? { ...s, status: "dismissed" as const } : s,
        ),
      );
    } catch {
      setError("Failed to dismiss suggestion");
    }
  }, []);

  const sendChatMessage = useCallback(async (content: string) => {
    setIsChatLoading(true);
    setError(null);

    const userMessage: AiChatMessage = {
      id: `ai_msg_${Date.now()}`,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, userMessage]);

    try {
      const reply = await sendAiMessage(content);

      const assistantMessage: AiChatMessage = {
        id: `ai_msg_${Date.now() + 1}`,
        role: "assistant",
        content: reply.content,
        createdAt: reply.timestamp ?? new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
      return assistantMessage;
    } catch {
      setError("Failed to get AI response");
      return null;
    } finally {
      setIsChatLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setChatMessages([]);
  }, []);

  const pendingSuggestions = suggestions.filter((s) => s.status === "pending");

  return {
    suggestions,
    pendingSuggestions,
    chatMessages,
    isLoading,
    isChatLoading,
    error,
    fetchSuggestions,
    acceptSuggestion,
    dismissSuggestion,
    sendChatMessage,
    clearChat,
  };
}
