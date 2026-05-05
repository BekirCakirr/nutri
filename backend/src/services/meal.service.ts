import { query, getClient } from "../config";

// ── Types ────────────────────────────────────────────────────────────────────

interface CreateMealInput {
  mealType: string;
  logDate: string;
  items: {
    foodId?: number;
    foodName?: string;
    amount: number;
    // Optional pre-computed nutrition (e.g., from AI photo analysis)
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  }[];
  notes?: string;
  entryMethod?: string;
}

interface UpdateMealInput {
  mealType?: string;
  notes?: string;
  dietitianFeedback?: string;
  dietitianViewed?: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export async function getPatientProfileId(userId: string): Promise<string> {
  const result = await query(
    "SELECT id FROM patient_profiles WHERE user_id = $1",
    [userId]
  );
  if (result.rows.length === 0) {
    throw Object.assign(new Error("Hasta profili bulunamadi"), {
      statusCode: 404,
    });
  }
  return result.rows[0].id;
}

function mapMealType(mealType: string): string {
  const snackTypes = ["morning_snack", "afternoon_snack", "evening_snack", "other"];
  return snackTypes.includes(mealType) ? "snack" : mealType;
}

// ── Service Functions ────────────────────────────────────────────────────────

export async function getTodayMeals(userId: string) {
  const patientId = await getPatientProfileId(userId);

  const mealsResult = await query(
    `SELECT * FROM meal_logs
     WHERE patient_id = $1 AND log_date = CURRENT_DATE
     ORDER BY logged_at ASC`,
    [patientId]
  );

  const meals = [];
  for (const meal of mealsResult.rows) {
    const itemsResult = await query(
      `SELECT * FROM meal_items WHERE meal_log_id = $1 ORDER BY id ASC`,
      [meal.id]
    );
    meals.push({
      ...meal,
      meal_type_mobile: mapMealType(meal.meal_type),
      items: itemsResult.rows,
    });
  }

  return meals;
}

export async function getMealHistory(
  userId: string,
  startDate: string,
  endDate: string,
  targetPatientId?: string
) {
  const patientId = targetPatientId || await getPatientProfileId(userId);

  const mealsResult = await query(
    `SELECT * FROM meal_logs
     WHERE patient_id = $1 AND log_date >= $2 AND log_date <= $3
     ORDER BY log_date DESC, logged_at DESC`,
    [patientId, startDate, endDate]
  );

  const meals = [];
  for (const meal of mealsResult.rows) {
    const itemsResult = await query(
      `SELECT * FROM meal_items WHERE meal_log_id = $1 ORDER BY id ASC`,
      [meal.id]
    );
    meals.push({
      ...meal,
      items: itemsResult.rows,
    });
  }

  return meals;
}

/**
 * Dietitian'ın bağlı tüm hastalarının öğünlerini döner.
 * Meal Review (Kanban) sayfası için.
 */
export async function getDietitianAllMeals(
  userId: string,
  startDate: string,
  endDate: string
) {
  // Dietitian profile id
  const dpRes = await query(
    "SELECT id FROM dietitian_profiles WHERE user_id = $1",
    [userId]
  );
  if (dpRes.rows.length === 0) {
    return [];
  }
  const dietitianId = dpRes.rows[0].id;

  const mealsResult = await query(
    `SELECT
        m.*,
        pp.first_name AS patient_first_name,
        pp.last_name  AS patient_last_name,
        pp.id         AS patient_id
     FROM meal_logs m
     JOIN patient_profiles pp ON pp.id = m.patient_id
     JOIN dietitian_patients dp
       ON dp.patient_id = pp.id
      AND dp.dietitian_id = $1
      AND dp.status = 'active'
     WHERE m.log_date >= $2 AND m.log_date <= $3
     ORDER BY m.log_date DESC, m.logged_at DESC
     LIMIT 50`,
    [dietitianId, startDate, endDate]
  );

  const meals = [];
  for (const meal of mealsResult.rows) {
    const itemsResult = await query(
      `SELECT * FROM meal_items WHERE meal_log_id = $1 ORDER BY id ASC`,
      [meal.id]
    );
    meals.push({
      ...meal,
      items: itemsResult.rows,
      patientName: `${meal.patient_first_name ?? ""} ${meal.patient_last_name ?? ""}`.trim(),
    });
  }

  return meals;
}

export async function getMealById(mealId: string) {
  const mealResult = await query(
    `SELECT * FROM meal_logs WHERE id = $1`,
    [mealId]
  );

  if (mealResult.rows.length === 0) {
    throw Object.assign(new Error("Ogun bulunamadi"), {
      statusCode: 404,
    });
  }

  const itemsResult = await query(
    `SELECT * FROM meal_items WHERE meal_log_id = $1 ORDER BY id ASC`,
    [mealId]
  );

  return {
    ...mealResult.rows[0],
    items: itemsResult.rows,
  };
}

export async function createMeal(userId: string, input: CreateMealInput) {
  const client = await getClient();
  try {
    await client.query("BEGIN");

    const patientId = await getPatientProfileId(userId);

    // Insert meal log
    const mealResult = await client.query(
      `INSERT INTO meal_logs (patient_id, meal_type, log_date, entry_method, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        patientId,
        input.mealType,
        input.logDate,
        input.entryMethod || "manual",
        input.notes || null,
      ]
    );
    const meal = mealResult.rows[0];

    // Insert meal items
    const items = [];
    for (const item of input.items) {
      let food: any = null;

      if (item.foodId) {
        const foodResult = await client.query(
          `SELECT id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g,
                  iron_mg, calcium_mg, vitamin_b12_mcg, vitamin_d_mcg, vitamin_c_mg
           FROM foods WHERE id = $1`,
          [item.foodId]
        );
        if (foodResult.rows.length === 0) {
          throw Object.assign(
            new Error(`Besin bulunamadi: ID ${item.foodId}`),
            { statusCode: 404 }
          );
        }
        food = foodResult.rows[0];
      } else {
        // AI-detected food without DB entry — use foodName with zero nutrition
        food = {
          id: null,
          name: item.foodName || 'Bilinmeyen Besin',
          calories_per_100g: 0, protein_per_100g: 0, carbs_per_100g: 0, fat_per_100g: 0,
          iron_mg: null, calcium_mg: null, vitamin_b12_mcg: null, vitamin_d_mcg: null, vitamin_c_mg: null,
        };
      }

      const amount = item.amount;
      const factor = amount / 100;

      // Use pre-computed nutrition from input (AI photo analysis) when provided,
      // otherwise calculate from food DB values
      const calories = item.calories != null
        ? +Number(item.calories).toFixed(2)
        : (food.calories_per_100g ? +(food.calories_per_100g * factor).toFixed(2) : null);
      const protein = item.protein != null
        ? +Number(item.protein).toFixed(2)
        : (food.protein_per_100g ? +(food.protein_per_100g * factor).toFixed(2) : null);
      const carbs = item.carbs != null
        ? +Number(item.carbs).toFixed(2)
        : (food.carbs_per_100g ? +(food.carbs_per_100g * factor).toFixed(2) : null);
      const fat = item.fat != null
        ? +Number(item.fat).toFixed(2)
        : (food.fat_per_100g ? +(food.fat_per_100g * factor).toFixed(2) : null);
      const ironMg = food.iron_mg ? +(food.iron_mg * factor).toFixed(2) : null;
      const calciumMg = food.calcium_mg ? +(food.calcium_mg * factor).toFixed(2) : null;
      const vitaminB12Mcg = food.vitamin_b12_mcg ? +(food.vitamin_b12_mcg * factor).toFixed(2) : null;
      const vitaminDMcg = food.vitamin_d_mcg ? +(food.vitamin_d_mcg * factor).toFixed(2) : null;
      const vitaminCMg = food.vitamin_c_mg ? +(food.vitamin_c_mg * factor).toFixed(2) : null;

      const itemResult = await client.query(
        `INSERT INTO meal_items (
          meal_log_id, food_id, food_name, final_amount_g,
          calories, protein, carbs, fat,
          iron_mg, calcium_mg, vitamin_b12_mcg, vitamin_d_mcg, vitamin_c_mg
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *`,
        [
          meal.id,
          food.id,
          food.name,
          amount,
          calories,
          protein,
          carbs,
          fat,
          ironMg,
          calciumMg,
          vitaminB12Mcg,
          vitaminDMcg,
          vitaminCMg,
        ]
      );
      items.push(itemResult.rows[0]);
    }

    // Calculate totals from inserted items
    const totalsResult = await client.query(
      `SELECT
        COALESCE(SUM(calories), 0) AS total_calories,
        COALESCE(SUM(protein), 0) AS total_protein,
        COALESCE(SUM(carbs), 0) AS total_carbs,
        COALESCE(SUM(fat), 0) AS total_fat,
        COALESCE(SUM(iron_mg), 0) AS total_iron_mg,
        COALESCE(SUM(calcium_mg), 0) AS total_calcium_mg,
        COALESCE(SUM(vitamin_b12_mcg), 0) AS total_vitamin_b12_mcg,
        COALESCE(SUM(vitamin_d_mcg), 0) AS total_vitamin_d_mcg,
        COALESCE(SUM(vitamin_c_mg), 0) AS total_vitamin_c_mg
       FROM meal_items WHERE meal_log_id = $1`,
      [meal.id]
    );
    const totals = totalsResult.rows[0];

    // Update meal_logs with totals
    const updatedMeal = await client.query(
      `UPDATE meal_logs SET
        total_calories = $1,
        total_protein = $2,
        total_carbs = $3,
        total_fat = $4,
        total_iron_mg = $5,
        total_calcium_mg = $6,
        total_vitamin_b12_mcg = $7,
        total_vitamin_d_mcg = $8,
        total_vitamin_c_mg = $9
       WHERE id = $10
       RETURNING *`,
      [
        totals.total_calories,
        totals.total_protein,
        totals.total_carbs,
        totals.total_fat,
        totals.total_iron_mg,
        totals.total_calcium_mg,
        totals.total_vitamin_b12_mcg,
        totals.total_vitamin_d_mcg,
        totals.total_vitamin_c_mg,
        meal.id,
      ]
    );

    await client.query("COMMIT");

    return {
      ...updatedMeal.rows[0],
      items,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function updateMeal(
  mealId: string,
  userId: string,
  input: UpdateMealInput
) {
  // Determine role
  const userRow = await query("SELECT role FROM users WHERE id = $1", [userId]);
  const role = userRow.rows[0]?.role;
  const isDietitian = role === "dietitian";

  // Verify ownership / access
  if (isDietitian) {
    // Dietitian: meal'in hastası, dietitian'ın bağlı hastası mı?
    const access = await query(
      `SELECT m.id
         FROM meal_logs m
         JOIN dietitian_patients dp
           ON dp.patient_id = m.patient_id
          AND dp.dietitian_id = (SELECT id FROM dietitian_profiles WHERE user_id = $2)
          AND dp.status = 'active'
        WHERE m.id = $1`,
      [mealId, userId]
    );
    if (access.rows.length === 0) {
      throw Object.assign(new Error("Bu ogune erisim yetkiniz yok"), {
        statusCode: 403,
      });
    }
  } else {
    const patientId = await getPatientProfileId(userId);
    const existing = await query(
      `SELECT id FROM meal_logs WHERE id = $1 AND patient_id = $2`,
      [mealId, patientId]
    );
    if (existing.rows.length === 0) {
      throw Object.assign(new Error("Ogun bulunamadi veya erisim yetkiniz yok"), {
        statusCode: 404,
      });
    }
  }

  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (input.mealType !== undefined) {
    fields.push(`meal_type = $${paramIndex++}`);
    values.push(input.mealType);
  }
  if (input.notes !== undefined) {
    fields.push(`notes = $${paramIndex++}`);
    values.push(input.notes);
  }
  if (isDietitian && input.dietitianFeedback !== undefined) {
    fields.push(`dietitian_feedback = $${paramIndex++}`);
    values.push(input.dietitianFeedback);
  }
  if (isDietitian && input.dietitianViewed !== undefined) {
    fields.push(`dietitian_viewed = $${paramIndex++}`);
    values.push(input.dietitianViewed);
  }

  if (fields.length === 0) {
    throw Object.assign(new Error("Guncellenecek alan belirtilmedi"), {
      statusCode: 400,
    });
  }

  values.push(mealId);
  const result = await query(
    `UPDATE meal_logs SET ${fields.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  const itemsResult = await query(
    `SELECT * FROM meal_items WHERE meal_log_id = $1 ORDER BY id ASC`,
    [mealId]
  );

  return {
    ...result.rows[0],
    items: itemsResult.rows,
  };
}

export async function deleteMeal(mealId: string, userId: string) {
  const patientId = await getPatientProfileId(userId);

  // Verify ownership
  const existing = await query(
    `SELECT id FROM meal_logs WHERE id = $1 AND patient_id = $2`,
    [mealId, patientId]
  );
  if (existing.rows.length === 0) {
    throw Object.assign(new Error("Ogun bulunamadi veya erisim yetkiniz yok"), {
      statusCode: 404,
    });
  }

  await query("DELETE FROM meal_logs WHERE id = $1", [mealId]);
}
