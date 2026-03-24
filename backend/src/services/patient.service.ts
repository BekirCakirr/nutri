import { query } from "../config";

interface UpdatePatientProfileInput {
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  gender?: string;
  height_cm?: number;
  current_weight_kg?: number;
  target_weight_kg?: number;
  activity_level?: string;
  goal_type?: string;
  diet_type?: string;
  daily_water_target?: number;
  sleep_hours?: number;
  profile_photo_url?: string;
  dark_mode?: boolean;
  language?: string;
  notification_enabled?: boolean;
  intermittent_fasting_enabled?: boolean;
  fasting_type?: string;
  fasting_start_hour?: string;
  fasting_end_hour?: string;
}

export async function getMyProfile(userId: string) {
  const result = await query(
    `SELECT pp.*, u.email
     FROM patient_profiles pp
     JOIN users u ON u.id = pp.user_id
     WHERE pp.user_id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw Object.assign(new Error("Hasta profili bulunamadi"), {
      statusCode: 404,
    });
  }

  return result.rows[0];
}

export async function updateMyProfile(
  userId: string,
  input: UpdatePatientProfileInput
) {
  // Build dynamic SET clause from provided fields
  const allowedFields = [
    "first_name",
    "last_name",
    "birth_date",
    "gender",
    "height_cm",
    "current_weight_kg",
    "target_weight_kg",
    "activity_level",
    "goal_type",
    "diet_type",
    "daily_water_target",
    "sleep_hours",
    "profile_photo_url",
    "dark_mode",
    "language",
    "notification_enabled",
    "intermittent_fasting_enabled",
    "fasting_type",
    "fasting_start_hour",
    "fasting_end_hour",
  ];

  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  for (const field of allowedFields) {
    if (field in input) {
      setClauses.push(`${field} = $${paramIndex}`);
      values.push((input as any)[field]);
      paramIndex++;
    }
  }

  if (setClauses.length === 0) {
    return getMyProfile(userId);
  }

  setClauses.push(`updated_at = NOW()`);
  values.push(userId);

  const result = await query(
    `UPDATE patient_profiles
     SET ${setClauses.join(", ")}
     WHERE user_id = $${paramIndex}
     RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw Object.assign(new Error("Hasta profili bulunamadi"), {
      statusCode: 404,
    });
  }

  return result.rows[0];
}

export async function getPatientById(patientProfileId: string) {
  const result = await query(
    `SELECT pp.*, u.email
     FROM patient_profiles pp
     JOIN users u ON u.id = pp.user_id
     WHERE pp.id = $1`,
    [patientProfileId]
  );

  if (result.rows.length === 0) {
    throw Object.assign(new Error("Hasta bulunamadi"), {
      statusCode: 404,
    });
  }

  return result.rows[0];
}

export async function getPatientsByDietitian(userId: string) {
  const result = await query(
    `SELECT pp.*, u.email, u.last_login_at,
       -- Compute adherence: % of days in last 7 that have meal logs
       COALESCE(
         (SELECT ROUND(COUNT(DISTINCT ml.log_date)::numeric / 7 * 100)
          FROM meal_logs ml
          WHERE ml.patient_id = pp.id
            AND ml.log_date >= CURRENT_DATE - 7),
         0
       ) AS adherence_score,
       -- Last activity timestamp
       GREATEST(
         u.last_login_at,
         (SELECT MAX(created_at) FROM meal_logs WHERE patient_id = pp.id),
         (SELECT MAX(created_at) FROM weight_logs WHERE patient_id = pp.id)
       ) AS last_activity_at
     FROM dietitian_profiles dp
     JOIN dietitian_patients dpat ON dpat.dietitian_id = dp.id
     JOIN patient_profiles pp ON pp.id = dpat.patient_id
     JOIN users u ON u.id = pp.user_id
     WHERE dp.user_id = $1 AND dpat.status = 'active'
     ORDER BY pp.first_name, pp.last_name`,
    [userId]
  );

  return result.rows;
}
