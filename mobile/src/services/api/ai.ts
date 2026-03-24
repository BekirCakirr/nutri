import type { AIMessage } from '@/types';
import apiClient from './client';

export async function sendAIMessage(content: string): Promise<AIMessage> {
  try {
    const { data } = await apiClient.post('/ai/chat', { message: content });
    const result = data.data ?? data;
    return {
      id: 'ai-' + Date.now(),
      role: 'assistant',
      content: result.reply ?? result.content ?? 'Yanıt alınamadı.',
      timestamp: new Date().toISOString(),
    };
  } catch {
    return {
      id: 'ai-' + Date.now(),
      role: 'assistant',
      content: 'AI servisi şu an kullanılamıyor. Lütfen daha sonra tekrar deneyin.',
      timestamp: new Date().toISOString(),
    };
  }
}

export async function getAISuggestions(): Promise<string[]> {
  // TODO: Backend AI suggestions endpoint needed
  return [
    'Bugün ne yemeliyim?',
    'Kalori hedefime nasıl ulaşabilirim?',
    'Protein açığımı nasıl kapatabilirim?',
  ];
}

export async function analyzeImage(imageUri: string): Promise<{
  foods: Array<{ name: string; calories: number; confidence: number }>;
}> {
  try {
    const { data } = await apiClient.post('/ai/analyze-meal', { imageUrl: imageUri });
    const result = data.data ?? data;
    return {
      foods: (result.foods ?? []).map((f: any) => ({
        name: f.name ?? '',
        calories: f.calories ?? f.estimatedGrams ?? 0,
        confidence: f.confidence ?? 0.8,
      })),
    };
  } catch {
    return { foods: [] };
  }
}
