import { query, getClient } from "../config";

// ── Types ────────────────────────────────────────────────────────────────────

interface CreatePlanItemInput {
  dayOfWeek: number;
  mealType: string;
  foodName: string;
  amountG?: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  alternatives?: string;
  notes?: string;
  sortOrder?: number;
}

interface CreatePlanInput {
  patientId: string;
  title: string;
  startDate: string;
  endDate?: string;
  dailyCalorieTarget?: number;
  dailyProteinTarget?: number;
  dailyCarbTarget?: number;
  dailyFatTarget?: number;
  specialNotes?: string;
  isBudgetFriendly?: boolean;
  items: CreatePlanItemInput[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function getPatientProfileId(userId: string): Promise<string> {
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

async function getDietitianProfileId(userId: string): Promise<string> {
  const result = await query(
    "SELECT id FROM dietitian_profiles WHERE user_id = $1",
    [userId]
  );
  if (result.rows.length === 0) {
    throw Object.assign(new Error("Diyetisyen profili bulunamadi"), {
      statusCode: 404,
    });
  }
  return result.rows[0].id;
}

// ── Service Functions ────────────────────────────────────────────────────────

export async function getPlansByPatient(userId: string) {
  const patientId = await getPatientProfileId(userId);

  const result = await query(
    `SELECT mp.*,
            (SELECT COUNT(*) FROM meal_plan_items mpi WHERE mpi.meal_plan_id = mp.id) AS item_count
     FROM meal_plans mp
     WHERE mp.patient_id = $1
     ORDER BY mp.created_at DESC`,
    [patientId]
  );

  return result.rows;
}

export async function getPlansByDietitian(userId: string) {
  const dietitianId = await getDietitianProfileId(userId);

  const result = await query(
    `SELECT mp.*,
            pp.first_name AS patient_first_name,
            pp.last_name AS patient_last_name,
            (SELECT COUNT(*) FROM meal_plan_items mpi WHERE mpi.meal_plan_id = mp.id) AS item_count
     FROM meal_plans mp
     JOIN patient_profiles pp ON pp.id = mp.patient_id
     WHERE mp.created_by_dietitian_id = $1
     ORDER BY mp.created_at DESC`,
    [dietitianId]
  );

  return result.rows;
}

export async function getPlanById(planId: string) {
  const planResult = await query(
    `SELECT * FROM meal_plans WHERE id = $1`,
    [planId]
  );

  if (planResult.rows.length === 0) {
    throw Object.assign(new Error("Beslenme plani bulunamadi"), {
      statusCode: 404,
    });
  }

  const itemsResult = await query(
    `SELECT * FROM meal_plan_items
     WHERE meal_plan_id = $1
     ORDER BY day_of_week ASC, sort_order ASC`,
    [planId]
  );

  return {
    ...planResult.rows[0],
    items: itemsResult.rows,
  };
}

export async function createPlan(userId: string, input: CreatePlanInput) {
  const client = await getClient();
  try {
    await client.query("BEGIN");

    const dietitianId = await getDietitianProfileId(userId);

    // Verify patient exists
    const patientCheck = await client.query(
      "SELECT id FROM patient_profiles WHERE id = $1",
      [input.patientId]
    );
    if (patientCheck.rows.length === 0) {
      throw Object.assign(new Error("Hasta profili bulunamadi"), {
        statusCode: 404,
      });
    }

    // Insert meal plan
    const planResult = await client.query(
      `INSERT INTO meal_plans (
        patient_id, created_by_type, created_by_dietitian_id, title,
        start_date, end_date, daily_calorie_target, daily_protein_target,
        daily_carb_target, daily_fat_target, special_notes, is_budget_friendly
      ) VALUES ($1, 'dietitian', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        input.patientId,
        dietitianId,
        input.title,
        input.startDate,
        input.endDate || null,
        input.dailyCalorieTarget || null,
        input.dailyProteinTarget || null,
        input.dailyCarbTarget || null,
        input.dailyFatTarget || null,
        input.specialNotes || null,
        input.isBudgetFriendly || false,
      ]
    );
    const plan = planResult.rows[0];

    // Insert meal plan items
    const items = [];
    for (const item of input.items) {
      const itemResult = await client.query(
        `INSERT INTO meal_plan_items (
          meal_plan_id, day_of_week, meal_type, food_name,
          amount_g, calories, protein, carbs, fat,
          alternatives, notes, sort_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *`,
        [
          plan.id,
          item.dayOfWeek,
          item.mealType,
          item.foodName,
          item.amountG || null,
          item.calories || null,
          item.protein || null,
          item.carbs || null,
          item.fat || null,
          item.alternatives || null,
          item.notes || null,
          item.sortOrder || 0,
        ]
      );
      items.push(itemResult.rows[0]);
    }

    await client.query("COMMIT");

    return {
      ...plan,
      items,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function updatePlanStatus(
  planId: string,
  userId: string,
  status: string
) {
  // Verify plan exists
  const existing = await query(
    `SELECT id FROM meal_plans WHERE id = $1`,
    [planId]
  );
  if (existing.rows.length === 0) {
    throw Object.assign(new Error("Beslenme plani bulunamadi"), {
      statusCode: 404,
    });
  }

  const result = await query(
    `UPDATE meal_plans SET status = $1 WHERE id = $2 RETURNING *`,
    [status, planId]
  );

  return result.rows[0];
}

export async function deletePlan(planId: string, userId: string) {
  const dietitianId = await getDietitianProfileId(userId);

  // Verify ownership
  const existing = await query(
    `SELECT id FROM meal_plans WHERE id = $1 AND created_by_dietitian_id = $2`,
    [planId, dietitianId]
  );
  if (existing.rows.length === 0) {
    throw Object.assign(
      new Error("Beslenme plani bulunamadi veya silme yetkiniz yok"),
      { statusCode: 404 }
    );
  }

  await query("DELETE FROM meal_plans WHERE id = $1", [planId]);
}
