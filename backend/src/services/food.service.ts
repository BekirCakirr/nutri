import { query } from "../config";

interface CreateFoodInput {
  name: string;
  name_en?: string;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g?: number;
  sugar_per_100g?: number;
  sodium_per_100g?: number;
  serving_size_g?: number;
  serving_description?: string;
  barcode?: string;
  image_url?: string;
  allergen_ids?: number[];
}

export async function searchFoods(
  q?: string,
  category?: string,
  page = 1,
  limit = 20
): Promise<{ foods: any[]; total: number; page: number; limit: number }> {
  const conditions: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (q) {
    conditions.push(
      `(name ILIKE $${paramIndex} OR name_en ILIKE $${paramIndex})`
    );
    params.push(`%${q}%`);
    paramIndex++;
  }

  if (category) {
    conditions.push(`category = $${paramIndex}`);
    params.push(category);
    paramIndex++;
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countResult = await query(
    `SELECT COUNT(*) FROM foods ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].count, 10);

  const offset = (page - 1) * limit;
  const foodsResult = await query(
    `SELECT * FROM foods ${whereClause} ORDER BY name ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...params, limit, offset]
  );

  return { foods: foodsResult.rows, total, page, limit };
}

export async function getFoodById(id: number) {
  const result = await query("SELECT * FROM foods WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    throw Object.assign(new Error("Besin bulunamadi"), { statusCode: 404 });
  }

  return result.rows[0];
}

export async function getFoodByBarcode(code: string) {
  const result = await query("SELECT * FROM foods WHERE barcode = $1", [code]);

  return result.rows[0] || null;
}

export async function createFood(input: CreateFoodInput) {
  const result = await query(
    `INSERT INTO foods (
      name, name_en, category,
      calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g,
      fiber_per_100g, sugar_per_100g, sodium_per_100g,
      serving_size_g, serving_description, barcode, image_url, allergen_ids
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *`,
    [
      input.name,
      input.name_en || null,
      input.category,
      input.calories_per_100g,
      input.protein_per_100g,
      input.carbs_per_100g,
      input.fat_per_100g,
      input.fiber_per_100g || null,
      input.sugar_per_100g || null,
      input.sodium_per_100g || null,
      input.serving_size_g || 100,
      input.serving_description || null,
      input.barcode || null,
      input.image_url || null,
      input.allergen_ids || null,
    ]
  );

  return result.rows[0];
}

export async function updateFood(id: number, input: Partial<CreateFoodInput>) {
  // Verify food exists
  const existing = await query("SELECT id FROM foods WHERE id = $1", [id]);
  if (existing.rows.length === 0) {
    throw Object.assign(new Error("Besin bulunamadi"), { statusCode: 404 });
  }

  const fields: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  const fieldMap: Record<string, any> = {
    name: input.name,
    name_en: input.name_en,
    category: input.category,
    calories_per_100g: input.calories_per_100g,
    protein_per_100g: input.protein_per_100g,
    carbs_per_100g: input.carbs_per_100g,
    fat_per_100g: input.fat_per_100g,
    fiber_per_100g: input.fiber_per_100g,
    sugar_per_100g: input.sugar_per_100g,
    sodium_per_100g: input.sodium_per_100g,
    serving_size_g: input.serving_size_g,
    serving_description: input.serving_description,
    barcode: input.barcode,
    image_url: input.image_url,
    allergen_ids: input.allergen_ids,
  };

  for (const [key, value] of Object.entries(fieldMap)) {
    if (value !== undefined) {
      fields.push(`${key} = $${paramIndex}`);
      params.push(value);
      paramIndex++;
    }
  }

  if (fields.length === 0) {
    return getFoodById(id);
  }

  params.push(id);
  const result = await query(
    `UPDATE foods SET ${fields.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
    params
  );

  return result.rows[0];
}
