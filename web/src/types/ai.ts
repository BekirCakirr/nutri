// ---------------------------------------------------------------------------
// AI / Machine Learning Types
// ---------------------------------------------------------------------------

import type { Timestamps } from "./common";
import type { NutritionInfo, FoodItemSummary } from "./food";
import type { MealType } from "./meal";

/** AI model provider. */
export type AIProvider = "openai" | "anthropic" | "google" | "internal";

/** Role in an AI conversation. */
export type AIMessageRole = "system" | "user" | "assistant" | "function";

/** AI conversation purpose. */
export type AIConversationType =
  | "nutrition_assistant"
  | "meal_planning"
  | "food_analysis"
  | "recipe_generation"
  | "health_coaching"
  | "symptom_checker"
  | "general";

/** AI suggestion status. */
export type AISuggestionStatus = "pending" | "accepted" | "rejected" | "expired";

/** AI confidence level. */
export type AIConfidence = "low" | "medium" | "high" | "very_high";

// ── Conversations ──────────────────────────────────────────────────────────

/** An AI conversation session. */
export interface AIConversation extends Timestamps {
  id: string;
  userId: string;
  type: AIConversationType;
  title?: string | null;
  messages: AIMessage[];
  /** Context provided to the AI (patient data, goals, etc.). */
  context?: AIConversationContext | null;
  isActive: boolean;
  model: string;
  provider: AIProvider;
  totalTokens: number;
  metadata?: Record<string, unknown>;
}

/** A single message in an AI conversation. */
export interface AIMessage {
  id: string;
  conversationId: string;
  role: AIMessageRole;
  content: string;
  /** Structured data attached to the message. */
  attachments?: AIMessageAttachment[];
  /** Function / tool calls made by the assistant. */
  toolCalls?: AIToolCall[];
  /** Token usage for this message. */
  tokens?: { prompt: number; completion: number; total: number };
  timestamp: string;
  /** Feedback on this specific message. */
  feedback?: AIMessageFeedback | null;
}

/** Attachment within an AI message (image, food log, etc.). */
export interface AIMessageAttachment {
  type: "image" | "food_log" | "nutrition_data" | "health_metrics" | "plan" | "recipe";
  label: string;
  data: unknown;
  url?: string;
}

/** A tool / function call made by the AI. */
export interface AIToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
}

/** Context injected into an AI conversation. */
export interface AIConversationContext {
  patientId?: string;
  patientProfile?: {
    age: number;
    gender: string;
    heightCm: number;
    weightKg: number;
    activityLevel: string;
    dietaryPreferences: string[];
    allergies: string[];
    medicalConditions: string[];
    goals: string[];
  };
  currentPlanId?: string;
  recentMeals?: Array<{
    date: string;
    mealType: string;
    totalCalories: number;
  }>;
  healthMetrics?: Record<string, number>;
  customInstructions?: string;
}

/** User feedback on an AI message. */
export interface AIMessageFeedback {
  messageId: string;
  rating: "positive" | "negative";
  reason?: string;
  comment?: string;
  createdAt: string;
}

// ── Food analysis ──────────────────────────────────────────────────────────

/** AI-powered food image analysis result. */
export interface FoodAnalysis {
  id: string;
  imageUrl: string;
  analyzedAt: string;
  confidence: AIConfidence;
  overallConfidenceScore: number;
  items: FoodAnalysisItem[];
  totalNutrition: NutritionInfo;
  /** Raw AI response for debugging. */
  rawResponse?: string;
  processingTimeMs: number;
  model: string;
}

/** A single identified food item from image analysis. */
export interface FoodAnalysisItem {
  name: string;
  confidence: number;
  estimatedPortionSize: string;
  estimatedPortionG: number;
  nutrition: NutritionInfo;
  /** Matched food from database (if found). */
  matchedFoodItem?: FoodItemSummary | null;
  /** Bounding box in the image (normalised 0-1). */
  boundingBox?: { x: number; y: number; width: number; height: number };
  alternatives?: Array<{ name: string; confidence: number }>;
}

/** Request to analyse a food image. */
export interface FoodAnalysisRequest {
  imageUrl?: string;
  imageBase64?: string;
  mealType?: MealType;
  additionalContext?: string;
}

// ── Suggestions ────────────────────────────────────────────────────────────

/** An AI-generated suggestion for the patient or dietitian. */
export interface AISuggestion extends Timestamps {
  id: string;
  userId: string;
  type: AISuggestionType;
  status: AISuggestionStatus;
  title: string;
  description: string;
  reasoning?: string | null;
  confidence: AIConfidence;
  priority: "low" | "medium" | "high";
  /** Structured payload specific to the suggestion type. */
  data?: Record<string, unknown>;
  /** Action the user can take. */
  actionUrl?: string | null;
  actionLabel?: string | null;
  expiresAt?: string | null;
  respondedAt?: string | null;
  feedbackComment?: string | null;
}

/** Suggestion type. */
export type AISuggestionType =
  | "meal_suggestion"
  | "recipe_suggestion"
  | "plan_adjustment"
  | "nutrient_warning"
  | "hydration_reminder"
  | "exercise_suggestion"
  | "goal_adjustment"
  | "food_swap"
  | "supplement_suggestion"
  | "lifestyle_tip"
  | "progress_insight";

/** Meal suggestion from AI. */
export interface AIMealSuggestion {
  mealType: MealType;
  name: string;
  description: string;
  items: Array<{
    name: string;
    servingSize: string;
    nutrition: Partial<NutritionInfo>;
    foodItemId?: string;
    recipeId?: string;
  }>;
  totalNutrition: NutritionInfo;
  reasoning: string;
  tags: string[];
}

/** Food swap suggestion. */
export interface AIFoodSwap {
  originalFood: string;
  originalNutrition: Partial<NutritionInfo>;
  suggestedFood: string;
  suggestedNutrition: Partial<NutritionInfo>;
  reason: string;
  benefit: string;
  foodItemId?: string;
}

/** Nutrient gap / warning from AI analysis. */
export interface AINutrientWarning {
  nutrient: string;
  currentIntake: number;
  recommendedIntake: number;
  unit: string;
  severity: "low" | "moderate" | "high";
  message: string;
  foodSources: string[];
}

// ── Recipe generation ──────────────────────────────────────────────────────

/** Request to generate a recipe using AI. */
export interface AIRecipeGenerationRequest {
  prompt?: string;
  ingredients?: string[];
  excludeIngredients?: string[];
  cuisine?: string;
  mealType?: MealType;
  maxCalories?: number;
  dietaryPreferences?: string[];
  allergenFree?: string[];
  servings?: number;
  maxPrepTimeMinutes?: number;
  difficulty?: "easy" | "medium" | "hard";
  patientId?: string;
}

/** AI-generated recipe result. */
export interface AIRecipeGenerationResult {
  title: string;
  description: string;
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
    preparation?: string;
  }>;
  steps: Array<{
    stepNumber: number;
    instruction: string;
    durationMinutes?: number;
  }>;
  nutrition: NutritionInfo;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  tips?: string[];
  tags: string[];
  confidence: AIConfidence;
}

// ── Plan generation ────────────────────────────────────────────────────────

/** Request to generate a meal plan using AI. */
export interface AIPlanGenerationRequest {
  patientId: string;
  durationDays: number;
  calorieTarget: number;
  macroTargets?: { proteinG: number; carbsG: number; fatG: number };
  dietaryPreferences?: string[];
  allergenFree?: string[];
  excludeFoods?: string[];
  mealTypes?: MealType[];
  cuisinePreferences?: string[];
  budgetLevel?: "low" | "medium" | "high";
  cookingSkill?: "beginner" | "intermediate" | "advanced";
  additionalNotes?: string;
}

/** AI-generated meal plan result. */
export interface AIPlanGenerationResult {
  title: string;
  description: string;
  days: Array<{
    dayIndex: number;
    meals: Array<{
      mealType: MealType;
      name: string;
      items: Array<{
        name: string;
        servingSize: string;
        nutrition: Partial<NutritionInfo>;
      }>;
      totalNutrition: NutritionInfo;
    }>;
    totalNutrition: NutritionInfo;
  }>;
  shoppingList: Array<{
    name: string;
    amount: number;
    unit: string;
    category: string;
  }>;
  confidence: AIConfidence;
  reasoning: string;
}

// ── Progress insights ──────────────────────────────────────────────────────

/** AI-generated progress insight for a patient. */
export interface AIProgressInsight {
  id: string;
  patientId: string;
  type: "trend" | "milestone" | "warning" | "celebration" | "recommendation";
  title: string;
  description: string;
  metric?: string;
  period?: string;
  dataPoints?: Array<{ date: string; value: number }>;
  confidence: AIConfidence;
  generatedAt: string;
}

/** Request AI insights for a patient. */
export interface AIInsightRequest {
  patientId: string;
  focusAreas?: string[];
  period?: "week" | "month" | "quarter";
  includeRecommendations?: boolean;
}

// ── Usage / billing ────────────────────────────────────────────────────────

/** AI feature usage for billing / quota tracking. */
export interface AIUsageStats {
  userId: string;
  period: string;
  totalRequests: number;
  totalTokens: number;
  byFeature: Record<string, { requests: number; tokens: number }>;
  quotaLimit: number;
  quotaUsed: number;
  quotaRemaining: number;
  resetAt: string;
}
