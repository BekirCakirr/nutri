import { query } from "../config";

interface CreateRecipeInput {
  name: string;
  description?: string;
  instructions?: string;
  prep_time_min?: number;
  cook_time_min?: number;
  servings?: number;
  calories_per_serving?: number;
  protein_per_serving?: number;
  carbs_per_serving?: number;
  fat_per_serving?: number;
  difficulty?: "easy" | "medium" | "hard";
  allergen_ids?: number[];
  image_url?: string;
  ingredients?: any;
  tags?: string[];
  season?: string[];
  estimated_cost_tl?: number;
  is_ai_generated?: boolean;
  is_budget_friendly?: boolean;
}

interface SearchFilters {
  q?: string;
  difficulty?: string;
  tags?: string[];
  maxCalories?: number;
  isBudgetFriendly?: boolean;
  page?: number;
  limit?: number;
}

export async function searchRecipes(
  filters: SearchFilters = {}
): Promise<{ recipes: any[]; total: number; page: number; limit: number }> {
  const { q, difficulty, tags, maxCalories, isBudgetFriendly } = filters;
  const page = filters.page || 1;
  const limit = filters.limit || 20;

  const conditions: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (q) {
    conditions.push(`name ILIKE $${paramIndex}`);
    params.push(`%${q}%`);
    paramIndex++;
  }

  if (difficulty) {
    conditions.push(`difficulty = $${paramIndex}`);
    params.push(difficulty);
    paramIndex++;
  }

  if (tags && tags.length > 0) {
    conditions.push(`tags && $${paramIndex}`);
    params.push(tags);
    paramIndex++;
  }

  if (maxCalories !== undefined) {
    conditions.push(`calories_per_serving <= $${paramIndex}`);
    params.push(maxCalories);
    paramIndex++;
  }

  if (isBudgetFriendly !== undefined) {
    conditions.push(`is_budget_friendly = $${paramIndex}`);
    params.push(isBudgetFriendly);
    paramIndex++;
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countResult = await query(
    `SELECT COUNT(*) FROM recipes ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].count, 10);

  const offset = (page - 1) * limit;
  const recipesResult = await query(
    `SELECT * FROM recipes ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...params, limit, offset]
  );

  return { recipes: recipesResult.rows, total, page, limit };
}

export async function getRecipeById(id: string) {
  const result = await query("SELECT * FROM recipes WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    throw Object.assign(new Error("Tarif bulunamadi"), { statusCode: 404 });
  }

  return result.rows[0];
}

export async function createRecipe(userId: string, input: CreateRecipeInput) {
  const result = await query(
    `INSERT INTO recipes (
      name, description, instructions,
      prep_time_min, cook_time_min, servings,
      calories_per_serving, protein_per_serving, carbs_per_serving, fat_per_serving,
      difficulty, allergen_ids, image_url, ingredients,
      tags, season, estimated_cost_tl,
      is_ai_generated, is_budget_friendly, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
    RETURNING *`,
    [
      input.name,
      input.description || null,
      input.instructions || null,
      input.prep_time_min || null,
      input.cook_time_min || null,
      input.servings || 1,
      input.calories_per_serving || null,
      input.protein_per_serving || null,
      input.carbs_per_serving || null,
      input.fat_per_serving || null,
      input.difficulty || "easy",
      input.allergen_ids || [],
      input.image_url || null,
      input.ingredients ? JSON.stringify(input.ingredients) : null,
      input.tags || [],
      input.season || [],
      input.estimated_cost_tl || null,
      input.is_ai_generated || false,
      input.is_budget_friendly || false,
      userId,
    ]
  );

  return result.rows[0];
}

export async function updateRecipe(id: string, input: Partial<CreateRecipeInput>) {
  const existing = await query("SELECT id FROM recipes WHERE id = $1", [id]);
  if (existing.rows.length === 0) {
    throw Object.assign(new Error("Tarif bulunamadi"), { statusCode: 404 });
  }

  const fields: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  const fieldMap: Record<string, any> = {
    name: input.name,
    description: input.description,
    instructions: input.instructions,
    prep_time_min: input.prep_time_min,
    cook_time_min: input.cook_time_min,
    servings: input.servings,
    calories_per_serving: input.calories_per_serving,
    protein_per_serving: input.protein_per_serving,
    carbs_per_serving: input.carbs_per_serving,
    fat_per_serving: input.fat_per_serving,
    difficulty: input.difficulty,
    allergen_ids: input.allergen_ids,
    image_url: input.image_url,
    ingredients: input.ingredients !== undefined ? JSON.stringify(input.ingredients) : undefined,
    tags: input.tags,
    season: input.season,
    estimated_cost_tl: input.estimated_cost_tl,
    is_ai_generated: input.is_ai_generated,
    is_budget_friendly: input.is_budget_friendly,
  };

  for (const [key, value] of Object.entries(fieldMap)) {
    if (value !== undefined) {
      fields.push(`${key} = $${paramIndex}`);
      params.push(value);
      paramIndex++;
    }
  }

  if (fields.length === 0) {
    return getRecipeById(id);
  }

  params.push(id);
  const result = await query(
    `UPDATE recipes SET ${fields.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
    params
  );

  return result.rows[0];
}
