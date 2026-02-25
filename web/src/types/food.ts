// ---------------------------------------------------------------------------
// Food & Nutrition Types
// ---------------------------------------------------------------------------

import type { Timestamps, NutritionUnit, PaginationParams } from "./common";

/** Food database source. */
export type FoodSource =
  | "usda"
  | "open_food_facts"
  | "custom"
  | "verified"
  | "community"
  | "brand";

/** Food category. */
export enum FoodCategory {
  Fruits = "fruits",
  Vegetables = "vegetables",
  Grains = "grains",
  Protein = "protein",
  Dairy = "dairy",
  Fats = "fats",
  Sweets = "sweets",
  Beverages = "beverages",
  Condiments = "condiments",
  Snacks = "snacks",
  Legumes = "legumes",
  NutsSeeds = "nuts_seeds",
  Seafood = "seafood",
  Poultry = "poultry",
  RedMeat = "red_meat",
  ProcessedMeat = "processed_meat",
  Eggs = "eggs",
  Supplements = "supplements",
  Other = "other",
}

/** Nutrient category grouping. */
export enum NutrientCategory {
  Macronutrient = "macronutrient",
  Vitamin = "vitamin",
  Mineral = "mineral",
  Amino = "amino_acid",
  FattyAcid = "fatty_acid",
  Other = "other",
}

// ── Core entities ──────────────────────────────────────────────────────────

/** A food item in the database. */
export interface FoodItem extends Timestamps {
  id: string;
  name: string;
  description?: string | null;
  brandName?: string | null;
  category: FoodCategory;
  subcategory?: string | null;
  source: FoodSource;
  sourceId?: string | null;
  barcode?: string | null;
  imageUrl?: string | null;
  isVerified: boolean;
  isOrganic?: boolean;
  isGlutenFree?: boolean;

  /** Nutrition per default serving. */
  nutrition: NutritionInfo;
  /** All available serving sizes. */
  servingSizes: ServingSize[];
  /** Default serving. */
  defaultServing: ServingSize;
  /** Full nutrient breakdown. */
  nutrients: Nutrient[];
  /** Allergen identifiers. */
  allergenIds: string[];
  /** Tags (e.g. "high protein", "low carb"). */
  tags: string[];
}

/** Lightweight food for search results. */
export interface FoodItemSummary {
  id: string;
  name: string;
  brandName?: string | null;
  category: FoodCategory;
  imageUrl?: string | null;
  caloriesPer100g: number;
  defaultServing: ServingSize;
  isVerified: boolean;
  source: FoodSource;
}

/** Serving size option. */
export interface ServingSize {
  id: string;
  name: string;
  amountG: number;
  unit: string;
  description?: string;
  isDefault: boolean;
  householdMeasure?: string;
}

/** Single nutrient value. */
export interface Nutrient {
  id: string;
  name: string;
  shortName?: string;
  category: NutrientCategory;
  value: number;
  unit: NutritionUnit;
  dailyValuePercent?: number | null;
  /** Reference daily intake for an average adult. */
  rdi?: number | null;
}

/** Aggregated nutrition information (the most-used shape). */
export interface NutritionInfo {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sugarG: number;
  saturatedFatG: number;
  transFatG?: number;
  monounsaturatedFatG?: number;
  polyunsaturatedFatG?: number;
  cholesterolMg: number;
  sodiumMg: number;
  potassiumMg?: number;
  calciumMg?: number;
  ironMg?: number;
  vitaminAMcg?: number;
  vitaminCMg?: number;
  vitaminDMcg?: number;
  vitaminEMg?: number;
  vitaminKMcg?: number;
  vitaminB6Mg?: number;
  vitaminB12Mcg?: number;
  folateMcg?: number;
  magnesiumMg?: number;
  zincMg?: number;
  seleniumMcg?: number;
  omega3Mg?: number;
  omega6Mg?: number;
  caffeineMg?: number;
  alcoholG?: number;
  waterMl?: number;
}

/** Empty / zero nutrition template helper. */
export type NutritionInfoKey = keyof NutritionInfo;

// ── Custom foods ───────────────────────────────────────────────────────────

/** Create a custom food item. */
export interface CreateFoodItemRequest {
  name: string;
  description?: string;
  brandName?: string;
  category: FoodCategory;
  barcode?: string;
  imageUrl?: string;
  nutrition: Partial<NutritionInfo>;
  servingSizes: Omit<ServingSize, "id">[];
  defaultServingIndex?: number;
  allergenIds?: string[];
  tags?: string[];
}

/** Update a custom food item. */
export interface UpdateFoodItemRequest extends Partial<CreateFoodItemRequest> {
  id: string;
}

// ── Search ─────────────────────────────────────────────────────────────────

/** Food search request. */
export interface FoodSearchParams {
  query: string;
  categories?: FoodCategory[];
  sources?: FoodSource[];
  allergenFree?: string[];
  isVerified?: boolean;
  minCalories?: number;
  maxCalories?: number;
  tags?: string[];
  barcode?: string;
  pagination: PaginationParams;
}

/** Barcode scan result. */
export interface BarcodeScanResult {
  barcode: string;
  found: boolean;
  foodItem?: FoodItem | null;
  suggestions?: FoodItemSummary[];
}

/** Nutrition label data (from OCR / image analysis). */
export interface NutritionLabel {
  servingSize: string;
  servingsPerContainer?: number;
  nutrients: Array<{
    name: string;
    value: number;
    unit: string;
    dailyValuePercent?: number;
  }>;
  ingredients?: string[];
  allergens?: string[];
  rawText?: string;
  confidence: number;
}

/** Nutrition comparison between two food items. */
export interface FoodComparison {
  items: [FoodItemSummary, FoodItemSummary];
  differences: Array<{
    nutrient: string;
    item1Value: number;
    item2Value: number;
    unit: string;
    percentDifference: number;
  }>;
}
