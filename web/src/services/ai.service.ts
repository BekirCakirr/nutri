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

export interface GeneratedPlanItem {
  dayOfWeek: number;
  mealType: string;
  foodName: string;
  amountG: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sortOrder: number;
}

export interface GeneratedPlan {
  items: GeneratedPlanItem[];
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
  dailyCarbTarget: number;
  dailyFatTarget: number;
  title: string;
  rawAnalysis: string;
}

export interface GeneratePlanParams {
  patientId?: string;
  dailyCalorieTarget?: number;
  goal?: "weight_loss" | "weight_gain" | "maintenance" | "muscle_gain";
  dietaryPreferences?: string[];
  allergies?: string[];
  durationDays?: number;
  notes?: string;
}

interface ApiAiChatResponse {
  reply?: string;
  content?: string;
}

export async function sendMessage(
  content: string,
  _context?: Record<string, unknown>,
): Promise<AiChatMessage> {
  const { data } = await api.post("/ai/chat", { message: content });
  const result = data as ApiAiChatResponse;
  return {
    role: "assistant",
    content: result.reply ?? result.content ?? "",
    timestamp: new Date().toISOString(),
  };
}

export async function getSuggestions(_patientId?: string): Promise<string[]> {
  // AI suggestions not yet a dedicated backend endpoint
  return [];
}

export async function analyzeMeal(mealData: { imageUrl: string }): Promise<MealAnalysis> {
  const { data } = await api.post("/ai/analyze-meal", mealData);
  return data as MealAnalysis;
}

export async function generatePlan(params: GeneratePlanParams): Promise<GeneratedPlan> {
  const { data } = await api.post("/ai/generate-plan", params);
  return data as GeneratedPlan;
}
