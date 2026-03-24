import { query } from "../config";

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

// ── Weight ───────────────────────────────────────────────────────────────────

export async function logWeight(
  userId: string,
  input: { weightKg: number; notes?: string }
) {
  const patientId = await getPatientProfileId(userId);

  const result = await query(
    `INSERT INTO weight_logs (patient_id, weight_kg, notes)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [patientId, input.weightKg, input.notes || null]
  );

  // Update current weight on patient profile
  await query(
    `UPDATE patient_profiles SET current_weight_kg = $1 WHERE id = $2`,
    [input.weightKg, patientId]
  );

  return result.rows[0];
}

export async function getWeightHistory(
  userId: string,
  startDate?: string,
  endDate?: string
) {
  const patientId = await getPatientProfileId(userId);

  const conditions = ["patient_id = $1"];
  const params: any[] = [patientId];
  let paramIndex = 2;

  if (startDate) {
    conditions.push(`measured_at >= $${paramIndex++}`);
    params.push(startDate);
  }
  if (endDate) {
    conditions.push(`measured_at <= $${paramIndex++}`);
    params.push(endDate);
  }

  const result = await query(
    `SELECT * FROM weight_logs
     WHERE ${conditions.join(" AND ")}
     ORDER BY measured_at DESC`,
    params
  );

  return result.rows;
}

// ── Water ────────────────────────────────────────────────────────────────────

export async function logWater(userId: string, glasses: number = 1) {
  const patientId = await getPatientProfileId(userId);

  const result = await query(
    `INSERT INTO water_logs (patient_id, glasses)
     VALUES ($1, $2)
     RETURNING *`,
    [patientId, glasses]
  );

  return result.rows[0];
}

export async function getTodayWater(userId: string) {
  const patientId = await getPatientProfileId(userId);

  const totalResult = await query(
    `SELECT COALESCE(SUM(glasses), 0) AS total_glasses
     FROM water_logs
     WHERE patient_id = $1 AND logged_at::date = CURRENT_DATE`,
    [patientId]
  );

  const targetResult = await query(
    `SELECT daily_water_target FROM patient_profiles WHERE id = $1`,
    [patientId]
  );

  return {
    totalGlasses: parseInt(totalResult.rows[0].total_glasses, 10),
    dailyTarget: targetResult.rows[0]?.daily_water_target || 8,
  };
}

export async function getWaterHistory(
  userId: string,
  startDate?: string,
  endDate?: string
) {
  const patientId = await getPatientProfileId(userId);

  const conditions = ["patient_id = $1"];
  const params: any[] = [patientId];
  let paramIndex = 2;

  if (startDate) {
    conditions.push(`logged_at >= $${paramIndex++}`);
    params.push(startDate);
  }
  if (endDate) {
    conditions.push(`logged_at <= $${paramIndex++}`);
    params.push(endDate);
  }

  const result = await query(
    `SELECT logged_at::date AS log_date, SUM(glasses) AS total_glasses
     FROM water_logs
     WHERE ${conditions.join(" AND ")}
     GROUP BY logged_at::date
     ORDER BY log_date DESC`,
    params
  );

  return result.rows;
}

// ── Exercise ─────────────────────────────────────────────────────────────────

export async function logExercise(
  userId: string,
  input: {
    exerciseType: string;
    durationMin: number;
    caloriesBurned?: number;
    intensity?: string;
    notes?: string;
  }
) {
  const patientId = await getPatientProfileId(userId);

  const result = await query(
    `INSERT INTO exercise_logs (patient_id, exercise_type, duration_min, calories_burned, intensity, notes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      patientId,
      input.exerciseType,
      input.durationMin,
      input.caloriesBurned || null,
      input.intensity || null,
      input.notes || null,
    ]
  );

  return result.rows[0];
}

export async function getExerciseHistory(
  userId: string,
  startDate?: string,
  endDate?: string
) {
  const patientId = await getPatientProfileId(userId);

  const conditions = ["patient_id = $1"];
  const params: any[] = [patientId];
  let paramIndex = 2;

  if (startDate) {
    conditions.push(`logged_at >= $${paramIndex++}`);
    params.push(startDate);
  }
  if (endDate) {
    conditions.push(`logged_at <= $${paramIndex++}`);
    params.push(endDate);
  }

  const result = await query(
    `SELECT * FROM exercise_logs
     WHERE ${conditions.join(" AND ")}
     ORDER BY logged_at DESC`,
    params
  );

  return result.rows;
}

// ── Sleep ────────────────────────────────────────────────────────────────────

export async function logSleep(
  userId: string,
  input: {
    sleepStart: string;
    sleepEnd: string;
    quality?: string;
    notes?: string;
  }
) {
  const patientId = await getPatientProfileId(userId);

  const result = await query(
    `INSERT INTO sleep_logs (patient_id, sleep_start, sleep_end, quality, notes)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      patientId,
      input.sleepStart,
      input.sleepEnd,
      input.quality || null,
      input.notes || null,
    ]
  );

  return result.rows[0];
}

export async function getSleepHistory(
  userId: string,
  startDate?: string,
  endDate?: string
) {
  const patientId = await getPatientProfileId(userId);

  const conditions = ["patient_id = $1"];
  const params: any[] = [patientId];
  let paramIndex = 2;

  if (startDate) {
    conditions.push(`logged_at >= $${paramIndex++}`);
    params.push(startDate);
  }
  if (endDate) {
    conditions.push(`logged_at <= $${paramIndex++}`);
    params.push(endDate);
  }

  const result = await query(
    `SELECT * FROM sleep_logs
     WHERE ${conditions.join(" AND ")}
     ORDER BY logged_at DESC`,
    params
  );

  return result.rows;
}

// ── Daily Summary ────────────────────────────────────────────────────────────

export async function getTodaySummary(userId: string) {
  const patientId = await getPatientProfileId(userId);

  // Meals — total calories today
  const mealsResult = await query(
    `SELECT COALESCE(SUM(total_calories), 0) AS total_calories
     FROM meal_logs
     WHERE patient_id = $1 AND log_date = CURRENT_DATE`,
    [patientId]
  );

  // Water — total glasses today
  const waterResult = await query(
    `SELECT COALESCE(SUM(glasses), 0) AS total_glasses
     FROM water_logs
     WHERE patient_id = $1 AND logged_at::date = CURRENT_DATE`,
    [patientId]
  );

  // Exercise — total duration today
  const exerciseResult = await query(
    `SELECT COALESCE(SUM(duration_min), 0) AS total_duration_min
     FROM exercise_logs
     WHERE patient_id = $1 AND logged_at::date = CURRENT_DATE`,
    [patientId]
  );

  // Weight — today's log (if any)
  const weightResult = await query(
    `SELECT weight_kg, measured_at
     FROM weight_logs
     WHERE patient_id = $1 AND measured_at::date = CURRENT_DATE
     ORDER BY measured_at DESC
     LIMIT 1`,
    [patientId]
  );

  return {
    calories: parseFloat(mealsResult.rows[0].total_calories),
    waterGlasses: parseInt(waterResult.rows[0].total_glasses, 10),
    exerciseMinutes: parseInt(exerciseResult.rows[0].total_duration_min, 10),
    weight: weightResult.rows[0] || null,
  };
}

// ── Generic Delete ───────────────────────────────────────────────────────────

const ALLOWED_TABLES = ["weight_logs", "water_logs", "exercise_logs", "sleep_logs"];

export async function deleteTrackingEntry(
  table: string,
  entryId: string,
  userId: string
) {
  if (!ALLOWED_TABLES.includes(table)) {
    throw Object.assign(new Error("Gecersiz tablo adi"), {
      statusCode: 400,
    });
  }

  const patientId = await getPatientProfileId(userId);

  const existing = await query(
    `SELECT id FROM ${table} WHERE id = $1 AND patient_id = $2`,
    [entryId, patientId]
  );

  if (existing.rows.length === 0) {
    throw Object.assign(new Error("Kayit bulunamadi veya erisim yetkiniz yok"), {
      statusCode: 404,
    });
  }

  await query(`DELETE FROM ${table} WHERE id = $1`, [entryId]);
}
