// ---------------------------------------------------------------------------
// Recipe Types
// ---------------------------------------------------------------------------

import type { PaginationParams, Timestamps } from "./common";
import type { NutritionInfo, FoodItemSummary, ServingSize } from "./food";

/** Recipe category. */
export enum RecipeCategory {
  Breakfast = "breakfast",
  Lunch = "lunch",
  Dinner = "dinner",
  Snack = "snack",
  Dessert = "dessert",
  Appetizer = "appetizer",
  Soup = "soup",
  Salad = "salad",
  Smoothie = "smoothie",
  Baking = "baking",
  SideDish = "side_dish",
  Sauce = "sauce",
  Beverage = "beverage",
  Other = "other",
}

/** Difficulty level. */
export type RecipeDifficulty = "easy" | "medium" | "hard" | "expert";

/** Recipe visibility. */
export type RecipeVisibility = "private" | "patients_only" | "public";

/** Dietary tag. */
export type DietaryTag =
  | "vegetarian"
  | "vegan"
  | "gluten_free"
  | "dairy_free"
  | "nut_free"
  | "egg_free"
  | "soy_free"
  | "sugar_free"
  | "low_carb"
  | "low_fat"
  | "low_sodium"
  | "high_protein"
  | "high_fiber"
  | "keto"
  | "paleo"
  | "whole30"
  | "mediterranean"
  | "halal"
  | "kosher"
  | "fodmap_friendly";

// ── Core entities ──────────────────────────────────────────────────────────

/** Full recipe entity. */
export interface Recipe extends Timestamps {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string | null;
  title: string;
  description?: string | null;
  category: RecipeCategory;
  cuisine?: string | null;
  difficulty: RecipeDifficulty;
  visibility: RecipeVisibility;

  /** Time fields in minutes. */
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  restTimeMinutes?: number;

  servings: number;
  servingSize?: string | null;

  ingredients: Ingredient[];
  steps: CookingStep[];

  /** Per-serving nutrition. */
  nutritionPerServing: NutritionInfo;
  /** Total recipe nutrition. */
  totalNutrition: NutritionInfo;

  imageUrl?: string | null;
  imageUrls?: string[];
  videoUrl?: string | null;

  dietaryTags: DietaryTag[];
  allergenIds: string[];
  tags: string[];

  /** Equipment needed. */
  equipment?: string[];
  /** Chef tips. */
  tips?: string[];
  /** Storage instructions. */
  storageInstructions?: string | null;
  /** Freezable? */
  isFreezable: boolean;

  /** Ratings / engagement. */
  averageRating: number;
  totalRatings: number;
  totalFavorites: number;
  totalViews: number;

  /** Source attribution. */
  sourceUrl?: string | null;
  sourceAttribution?: string | null;

  /** AI-generated. */
  isAiGenerated: boolean;

  /** Linked meal plan IDs. */
  linkedPlanIds?: string[];
}

/** Lightweight recipe for cards / lists. */
export interface RecipeSummary {
  id: string;
  title: string;
  description?: string | null;
  category: RecipeCategory;
  difficulty: RecipeDifficulty;
  totalTimeMinutes: number;
  servings: number;
  imageUrl?: string | null;
  caloriesPerServing: number;
  proteinPerServing: number;
  dietaryTags: DietaryTag[];
  averageRating: number;
  totalRatings: number;
  authorName: string;
  isFavorited: boolean;
}

/** A single ingredient in a recipe. */
export interface Ingredient {
  id: string;
  recipeId: string;
  foodItemId?: string | null;
  name: string;
  amount: number;
  unit: string;
  preparation?: string | null;
  isOptional: boolean;
  substituteFor?: string | null;
  group?: string | null;
  sortOrder: number;
  nutrition?: NutritionInfo | null;
}

/** A cooking step. */
export interface CookingStep {
  id: string;
  recipeId: string;
  stepNumber: number;
  instruction: string;
  durationMinutes?: number | null;
  temperature?: CookingTemperature | null;
  imageUrl?: string | null;
  videoTimestamp?: number | null;
  tips?: string | null;
}

/** Cooking temperature. */
export interface CookingTemperature {
  value: number;
  unit: "celsius" | "fahrenheit";
  method?: "oven" | "stovetop" | "grill" | "air_fryer" | "microwave" | "other";
}

// ── Ingredient substitution ────────────────────────────────────────────────

/** Suggested substitute for an ingredient. */
export interface IngredientSubstitution {
  originalIngredientId: string;
  originalName: string;
  substitutes: Array<{
    name: string;
    amount: number;
    unit: string;
    notes?: string;
    nutritionDifference?: Partial<NutritionInfo>;
    reason: "allergy" | "preference" | "availability" | "nutrition";
  }>;
}

// ── Scaling ────────────────────────────────────────────────────────────────

/** Recipe scaled to a different number of servings. */
export interface ScaledRecipe {
  originalServings: number;
  scaledServings: number;
  scaleFactor: number;
  ingredients: Array<{
    name: string;
    originalAmount: number;
    scaledAmount: number;
    unit: string;
  }>;
  nutritionPerServing: NutritionInfo;
}

// ── Requests ───────────────────────────────────────────────────────────────

/** Create a new recipe. */
export interface CreateRecipeRequest {
  title: string;
  description?: string;
  category: RecipeCategory;
  cuisine?: string;
  difficulty: RecipeDifficulty;
  visibility?: RecipeVisibility;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  restTimeMinutes?: number;
  servings: number;
  servingSize?: string;
  ingredients: Omit<Ingredient, "id" | "recipeId" | "nutrition">[];
  steps: Omit<CookingStep, "id" | "recipeId">[];
  imageUrl?: string;
  imageUrls?: string[];
  videoUrl?: string;
  dietaryTags?: DietaryTag[];
  allergenIds?: string[];
  tags?: string[];
  equipment?: string[];
  tips?: string[];
  storageInstructions?: string;
  isFreezable?: boolean;
  sourceUrl?: string;
  sourceAttribution?: string;
}

/** Update a recipe. */
export interface UpdateRecipeRequest extends Partial<CreateRecipeRequest> {
  id: string;
}

/** Recipe search / filter. */
export interface RecipeFilters {
  search?: string;
  categories?: RecipeCategory[];
  difficulty?: RecipeDifficulty[];
  dietaryTags?: DietaryTag[];
  allergenFree?: string[];
  maxTotalTime?: number;
  maxCalories?: number;
  minProtein?: number;
  cuisine?: string[];
  authorId?: string;
  isFavorited?: boolean;
  isAiGenerated?: boolean;
  tags?: string[];
  pagination: PaginationParams;
  sortBy?: "rating" | "newest" | "popular" | "prep_time" | "calories";
}

/** Recipe collection / cookbook. */
export interface RecipeCollection extends Timestamps {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  recipeIds: string[];
  recipeCount: number;
  isPublic: boolean;
}
