// ---------------------------------------------------------------------------
// AI Service
// ---------------------------------------------------------------------------

import { mockAiSuggestions, simulateApiCall } from "@/mock";

type AiSuggestion = (typeof mockAiSuggestions)[number];

// ── Types ────────────────────────────────────────────────────────────────────

export interface AiChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface MealAnalysis {
  totalCalories: number;
  macroBalance: string;
  suggestions: string[];
  score: number;
}

export interface GeneratedPlan {
  title: string;
  description: string;
  dailyCalorieTarget: number;
  meals: {
    type: string;
    name: string;
    calories: number;
    items: string[];
  }[];
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function sendMessage(
  content: string,
  _context?: Record<string, unknown>,
): Promise<AiChatMessage> {
  void content;
  return simulateApiCall(
    {
      id: `ai_msg_${Date.now()}`,
      role: "assistant" as const,
      content:
        "Bu hastanin beslenme duzeni genel olarak dengeli gorunuyor. " +
        "Protein alimini biraz artirmasini ve ogenlerini daha duzgun zamanlara dagitmasini oneririm.",
      createdAt: new Date().toISOString(),
    },
    500,
  );
}

export async function getSuggestions(
  patientId?: string,
): Promise<AiSuggestion[]> {
  let items = [...mockAiSuggestions];
  if (patientId) {
    items = items.filter((s) => s.patientId === patientId);
  }
  return simulateApiCall(items, 400);
}

export async function analyzeMeal(mealData: {
  items: { name: string; quantity: number; unit: string }[];
}): Promise<MealAnalysis> {
  void mealData;
  return simulateApiCall(
    {
      totalCalories: 520,
      macroBalance: "Protein agirlikli, dengeli",
      suggestions: [
        "Lifli gida ekleyerek tok kalma suresini artirabilirsiniz",
        "Yag oranini biraz azaltmayi deneyin",
      ],
      score: 78,
    },
    500,
  );
}

export async function generatePlan(params: {
  patientId: string;
  goal: string;
  preferences?: string[];
}): Promise<GeneratedPlan> {
  void params;
  return simulateApiCall(
    {
      title: "AI Tarafindan Olusturulan Beslenme Plani",
      description: "Hasta profili ve hedeflerine gore optimize edilmis plan",
      dailyCalorieTarget: 2000,
      meals: [
        {
          type: "breakfast",
          name: "Dengeli Kahvalti",
          calories: 400,
          items: ["Yumurta", "Tam bugday ekmegi", "Domates", "Zeytinyagi"],
        },
        {
          type: "lunch",
          name: "Protein Agirlikli Ogle",
          calories: 600,
          items: ["Izgara tavuk", "Bulgur pilavi", "Mevsim salatasi"],
        },
        {
          type: "dinner",
          name: "Hafif Aksam Yemegi",
          calories: 500,
          items: ["Izgara balik", "Buharda sebze", "Yogurt"],
        },
        {
          type: "snack",
          name: "Ara Ogunler",
          calories: 500,
          items: ["Meyve", "Kuruyemis", "Sut"],
        },
      ],
    },
    500,
  );
}
