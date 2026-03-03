// ---------------------------------------------------------------------------
// Shopping List Types
// ---------------------------------------------------------------------------

import type { Timestamps, PaginationParams } from "./common";

/** Shopping list status. */
export type ShoppingListStatus = "active" | "completed" | "archived";

/** Shopping item status. */
export type ShoppingItemStatus = "pending" | "purchased" | "skipped" | "unavailable";

/** Shopping item category (aisle grouping). */
export const ShoppingCategory = {
  FruitsVegetables: "fruits_vegetables",
  MeatSeafood: "meat_seafood",
  Dairy: "dairy",
  Bakery: "bakery",
  GrainsAndCereals: "grains_cereals",
  CannedGoods: "canned_goods",
  FrozenFoods: "frozen_foods",
  Snacks: "snacks",
  Beverages: "beverages",
  Condiments: "condiments",
  Spices: "spices",
  Oils: "oils",
  NutsSeeds: "nuts_seeds",
  HealthFoods: "health_foods",
  Supplements: "supplements",
  BabyFood: "baby_food",
  Household: "household",
  PersonalCare: "personal_care",
  Other: "other",
} as const
export type ShoppingCategory = (typeof ShoppingCategory)[keyof typeof ShoppingCategory]

/** How the shopping list was generated. */
export type ShoppingListSource = "manual" | "diet_plan" | "recipe" | "ai_suggested" | "recurring";

// ── Core entities ──────────────────────────────────────────────────────────

/** A shopping list. */
export interface ShoppingList extends Timestamps {
  id: string;
  userId: string;
  patientId?: string | null;
  title: string;
  status: ShoppingListStatus;
  source: ShoppingListSource;
  /** Related plan or recipe. */
  planId?: string | null;
  recipeIds?: string[];
  items: ShoppingItem[];
  totalItems: number;
  purchasedItems: number;
  estimatedCost?: number | null;
  currency?: string | null;
  storeName?: string | null;
  scheduledDate?: string | null;
  completedAt?: string | null;
  notes?: string | null;
  isShared: boolean;
  sharedWithUserIds?: string[];
}

/** Lightweight shopping list for the list view. */
export interface ShoppingListSummary {
  id: string;
  title: string;
  status: ShoppingListStatus;
  source: ShoppingListSource;
  totalItems: number;
  purchasedItems: number;
  scheduledDate?: string | null;
  createdAt: string;
}

/** A single item in a shopping list. */
export interface ShoppingItem extends Timestamps {
  id: string;
  shoppingListId: string;
  name: string;
  category: ShoppingCategory;
  amount: number;
  unit: string;
  status: ShoppingItemStatus;
  /** Link to food database. */
  foodItemId?: string | null;
  /** Which recipe needed this. */
  recipeId?: string | null;
  recipeName?: string | null;
  brandPreference?: string | null;
  estimatedPrice?: number | null;
  actualPrice?: number | null;
  notes?: string | null;
  isStaple: boolean;
  sortOrder: number;
  purchasedAt?: string | null;
  purchasedBy?: string | null;
}

// ── Staple items ───────────────────────────────────────────────────────────

/** A frequently-bought staple item. */
export interface StapleItem {
  id: string;
  userId: string;
  name: string;
  category: ShoppingCategory;
  defaultAmount: number;
  defaultUnit: string;
  foodItemId?: string | null;
  brandPreference?: string | null;
  purchaseFrequency: "weekly" | "biweekly" | "monthly" | "as_needed";
}

// ── Requests ───────────────────────────────────────────────────────────────

/** Create a new shopping list. */
export interface CreateShoppingListRequest {
  title: string;
  source?: ShoppingListSource;
  planId?: string;
  recipeIds?: string[];
  items?: CreateShoppingItemRequest[];
  storeName?: string;
  scheduledDate?: string;
  notes?: string;
  isShared?: boolean;
  sharedWithUserIds?: string[];
}

/** Create a shopping item. */
export interface CreateShoppingItemRequest {
  name: string;
  category: ShoppingCategory;
  amount: number;
  unit: string;
  foodItemId?: string;
  recipeId?: string;
  brandPreference?: string;
  estimatedPrice?: number;
  notes?: string;
  isStaple?: boolean;
  sortOrder?: number;
}

/** Update a shopping item. */
export interface UpdateShoppingItemRequest extends Partial<CreateShoppingItemRequest> {
  id: string;
  status?: ShoppingItemStatus;
  actualPrice?: number;
}

/** Generate list from plan / recipes. */
export interface GenerateShoppingListRequest {
  title?: string;
  planId?: string;
  recipeIds?: string[];
  servingsMultiplier?: number;
  excludeStaples?: boolean;
  includeStaples?: boolean;
  mergeWithExisting?: string;
  scheduledDate?: string;
}

/** Merge multiple lists. */
export interface MergeShoppingListsRequest {
  listIds: string[];
  newTitle: string;
  deduplicateItems: boolean;
}

/** Shopping list filters. */
export interface ShoppingListFilters {
  status?: ShoppingListStatus[];
  source?: ShoppingListSource[];
  search?: string;
  startDate?: string;
  endDate?: string;
  pagination: PaginationParams;
}

/** Price comparison suggestion. */
export interface PriceComparison {
  itemName: string;
  stores: Array<{
    storeName: string;
    price: number;
    currency: string;
    isOnSale: boolean;
    saleEndDate?: string;
  }>;
}
