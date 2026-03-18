import api from "@/lib/axios";

export interface AiChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface MealAnalysis {
  foods: Array<{
    name: string;
    estimatedGrams: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
  rawAnalysis: string;
}

export interface GeneratedPlan {
  title: string;
  days: Array<{
    dayOfWeek: number;
    meals: Array<{
      mealType: string;
      foodName: string;
      amountG: number;
      calories: number;
    }>;
  }>;
}

export async function sendMessage(
  content: string,
  _context?: Record<string, unknown>,
): Promise<AiChatMessage> {
  const { data } = await api.post("/ai/chat", { message: content });
  const result = data as any;
  return {
    role: "assistant",
    content: result.reply ?? result.content ?? "",
    timestamp: new Date().toISOString(),
  };
}

export async function getSuggestions(_patientId?: string): Promise<any[]> {
  // AI suggestions not yet a dedicated backend endpoint
  return [];
}

export async function analyzeMeal(mealData: { imageUrl: string }): Promise<MealAnalysis> {
  const { data } = await api.post("/ai/analyze-meal", mealData);
  return data as MealAnalysis;
}

export async function generatePlan(_params: Record<string, unknown>): Promise<GeneratedPlan> {
  // AI plan generation not yet implemented
  return { title: "", days: [] };
}
