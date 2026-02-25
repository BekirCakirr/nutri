import { useState, useCallback } from 'react';
import type { AIMessage } from '@/types';
import * as aiApi from '@/services/api/ai';

export function useAI() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: AIMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await aiApi.sendAIMessage(content);
      setMessages((prev) => [...prev, response]);
    } catch {
      const errorMessage: AIMessage = {
        id: 'error-' + Date.now(),
        role: 'assistant',
        content: 'Bir hata olustu. Lutfen tekrar deneyin.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSuggestions = useCallback(async () => {
    const result = await aiApi.getAISuggestions();
    setSuggestions(result);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    suggestions,
    sendMessage,
    loadSuggestions,
    clearMessages,
  };
}
