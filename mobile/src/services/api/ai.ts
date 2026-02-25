import type { AIMessage } from '@/types';

const delay = (ms = 1200) => new Promise((r) => setTimeout(r, ms));

const mockResponses: Record<string, string> = {
  default: 'Merhaba! Size beslenme konusunda yard\u0131mc\u0131 olabilirim. Ne sormak istersiniz?',
  kalori: 'G\u00fcnl\u00fck kalori ihtiyac\u0131n\u0131z ya\u015f, kilo, boy ve aktivite d\u00fczeyinize g\u00f6re de\u011fi\u015fir. Profilinize g\u00f6re yakla\u015f\u0131k 1.650 kcal \u00f6neriyorum.',
  protein: '\u0130yi protein kaynaklar\u0131 aras\u0131nda tavuk g\u00f6\u011fs\u00fc, yumurta, mercimek, yo\u011furt ve bal\u0131k bulunur. G\u00fcnl\u00fck en az 50g protein alman\u0131z\u0131 \u00f6neririm.',
  su: 'Kilonuza g\u00f6re g\u00fcnde yakla\u015f\u0131k 2.4 litre su i\u00e7menizi \u00f6neririm. Bunu g\u00fcn i\u00e7ine yayarak i\u00e7meyi deneyin.',
  diyet: 'Sa\u011fl\u0131kl\u0131 kilo verme i\u00e7in g\u00fcnl\u00fck 300-500 kcal a\u00e7\u0131k olu\u015fturman\u0131z yeterli. Haftada 0.5-1 kg vermek idealdir.',
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('kalori') || lower.includes('kcal')) return mockResponses.kalori;
  if (lower.includes('protein')) return mockResponses.protein;
  if (lower.includes('su') || lower.includes('water')) return mockResponses.su;
  if (lower.includes('diyet') || lower.includes('kilo')) return mockResponses.diyet;
  return mockResponses.default;
}

export async function sendAIMessage(content: string): Promise<AIMessage> {
  await delay();
  return {
    id: 'ai-' + Date.now(),
    role: 'assistant',
    content: getAIResponse(content),
    timestamp: new Date().toISOString(),
  };
}

export async function getAISuggestions(): Promise<string[]> {
  await delay(400);
  return [
    'Bug\u00fcn ne yemeliyim?',
    'Kalori hesaplamas\u0131 yapar m\u0131s\u0131n?',
    'Sa\u011fl\u0131kl\u0131 at\u0131\u015ft\u0131rmal\u0131k \u00f6ner',
    'Protein kaynaklar\u0131 nelerdir?',
  ];
}

export async function analyzeImage(_imageUri: string): Promise<{
  foods: Array<{ name: string; calories: number; confidence: number }>;
}> {
  await delay(2000);
  return {
    foods: [
      { name: 'Mercimek \u00c7orbas\u0131', calories: 180, confidence: 0.92 },
      { name: 'Ekmek', calories: 80, confidence: 0.88 },
    ],
  };
}
