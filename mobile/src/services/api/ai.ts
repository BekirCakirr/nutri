import type { AIMessage } from '@/types';
import apiClient from './client';

export async function sendAIMessage(content: string): Promise<AIMessage> {
  const { data } = await apiClient.post(
    '/ai/chat',
    { message: content },
    { timeout: 60000 },
  );
  const result = data?.data ?? data ?? {};
  const reply = result.reply ?? result.content;
  if (!reply || typeof reply !== 'string') {
    throw new Error('AI yanıtı alınamadı.');
  }
  return {
    id: String(result.messageId ?? 'ai-' + Date.now()),
    role: 'assistant',
    content: reply,
    timestamp: new Date().toISOString(),
  };
}

export async function getAISuggestions(): Promise<string[]> {
  // TODO: Backend AI suggestions endpoint needed
  return [
    'Bugün ne yemeliyim?',
    'Kalori hedefime nasıl ulaşabilirim?',
    'Protein açığımı nasıl kapatabilirim?',
  ];
}

export async function analyzeImage(imageBase64: string): Promise<{
  foods: Array<{ name: string; calories: number; protein: number; carbs: number; fat: number; portion: string }>;
  confidence: number;
}> {
  // Ensure full data URL format for backend
  let imageUrl = imageBase64;
  if (imageBase64 && !imageBase64.startsWith('data:image')) {
    imageUrl = `data:image/jpeg;base64,${imageBase64.replace(/^data:image\/[a-z]+;base64,/, '')}`;
  }

  try {
    const { data } = await apiClient.post(
      '/ai/analyze-meal',
      { imageUrl },
      {
        timeout: 60000,
        maxBodyLength: 20 * 1024 * 1024,
        maxContentLength: 20 * 1024 * 1024,
      },
    );
    const result = data?.data ?? data ?? {};
    const rawFoods = Array.isArray(result.foods) ? result.foods : [];
    return {
      foods: rawFoods.map((f: any) => ({
        name: f?.name ?? 'Bilinmeyen Besin',
        calories: Number(f?.calories) || 0,
        protein: Number(f?.protein) || 0,
        carbs: Number(f?.carbs) || 0,
        fat: Number(f?.fat) || 0,
        portion: f?.estimatedGrams ? `${f.estimatedGrams}g` : '1 Porsiyon',
      })),
      confidence: rawFoods.length > 0 ? 0.92 : 0,
    };
  } catch (err: any) {
    const status = err?.response?.status;
    const msg = err?.response?.data?.message || err?.message || 'Bilinmeyen hata';
    // Helpful diagnostic for debugging on web
    // eslint-disable-next-line no-console
    console.error('[analyzeImage] FAILED', { status, msg, payloadKB: Math.round((imageUrl?.length || 0) / 1024) });
    throw new Error(`AI analiz hatası (${status || 'network'}): ${msg}`);
  }
}
