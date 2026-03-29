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

// ── Service Functions ────────────────────────────────────────────────────────

export async function getWeeklyReports(
  userId: string,
  page: number = 1,
  limit: number = 10,
  targetPatientId?: string
) {
  const patientId = targetPatientId || await getPatientProfileId(userId);
  const offset = (page - 1) * limit;

  const countResult = await query(
    "SELECT COUNT(*) FROM ai_weekly_reports WHERE patient_id = $1",
    [patientId]
  );
  const total = parseInt(countResult.rows[0].count, 10);

  const reportsResult = await query(
    `SELECT * FROM ai_weekly_reports
     WHERE patient_id = $1
     ORDER BY week_start DESC
     LIMIT $2 OFFSET $3`,
    [patientId, limit, offset]
  );

  return {
    reports: reportsResult.rows,
    total,
    page,
    limit,
  };
}

export async function getReportById(reportId: string) {
  const result = await query(
    "SELECT * FROM ai_weekly_reports WHERE id = $1",
    [reportId]
  );

  if (result.rows.length === 0) {
    throw Object.assign(new Error("Rapor bulunamadi"), {
      statusCode: 404,
    });
  }

  return result.rows[0];
}

export async function generateWeeklyReport(
  userId: string,
  weekStart: string,
  weekEnd: string
) {
  const patientId = await getPatientProfileId(userId);

  // 1. Meal logs: total calories per day, avg protein/carbs/fat
  const mealsResult = await query(
    `SELECT
       log_date,
       COALESCE(SUM(total_calories), 0) AS daily_calories,
       COALESCE(SUM(total_protein), 0)  AS daily_protein,
       COALESCE(SUM(total_carbs), 0)    AS daily_carbs,
       COALESCE(SUM(total_fat), 0)      AS daily_fat
     FROM meal_logs
     WHERE patient_id = $1 AND log_date >= $2 AND log_date <= $3
     GROUP BY log_date
     ORDER BY log_date ASC`,
    [patientId, weekStart, weekEnd]
  );

  const mealDays = mealsResult.rows;
  const totalDays = mealDays.length || 1;
  const avgProtein =
    mealDays.reduce((sum: number, d: any) => sum + parseFloat(d.daily_protein), 0) / totalDays;
  const avgCarbs =
    mealDays.reduce((sum: number, d: any) => sum + parseFloat(d.daily_carbs), 0) / totalDays;
  const avgFat =
    mealDays.reduce((sum: number, d: any) => sum + parseFloat(d.daily_fat), 0) / totalDays;

  // 2. Weight logs: start weight, end weight, change
  const weightResult = await query(
    `SELECT weight_kg, measured_at::date AS log_date
     FROM weight_logs
     WHERE patient_id = $1 AND measured_at::date >= $2 AND measured_at::date <= $3
     ORDER BY measured_at ASC`,
    [patientId, weekStart, weekEnd]
  );

  const weightLogs = weightResult.rows;
  const startWeight = weightLogs.length > 0 ? parseFloat(weightLogs[0].weight_kg) : null;
  const endWeight = weightLogs.length > 0 ? parseFloat(weightLogs[weightLogs.length - 1].weight_kg) : null;
  const weightChange = startWeight !== null && endWeight !== null ? +(endWeight - startWeight).toFixed(2) : null;

  // 3. Water logs: avg glasses per day, goal adherence
  const waterResult = await query(
    `SELECT logged_at::date AS log_date, COALESCE(SUM(glasses), 0) AS daily_glasses
     FROM water_logs
     WHERE patient_id = $1 AND logged_at::date >= $2 AND logged_at::date <= $3
     GROUP BY logged_at::date`,
    [patientId, weekStart, weekEnd]
  );

  const profileResult = await query(
    "SELECT daily_water_target FROM patient_profiles WHERE id = $1",
    [patientId]
  );
  const dailyWaterTarget = profileResult.rows[0]?.daily_water_target || 8;

  const waterDays = waterResult.rows;
  const avgGlassesPerDay =
    waterDays.length > 0
      ? +(waterDays.reduce((sum: number, d: any) => sum + parseFloat(d.daily_glasses), 0) / waterDays.length).toFixed(1)
      : 0;
  const daysMetWaterGoal = waterDays.filter(
    (d: any) => parseFloat(d.daily_glasses) >= dailyWaterTarget
  ).length;
  const waterGoalAdherence =
    waterDays.length > 0 ? +((daysMetWaterGoal / waterDays.length) * 100).toFixed(1) : 0;

  // 4. Exercise logs: total duration, total calories burned
  const exerciseResult = await query(
    `SELECT
       COALESCE(SUM(duration_min), 0) AS total_duration,
       COALESCE(SUM(calories_burned), 0)  AS total_calories_burned
     FROM exercise_logs
     WHERE patient_id = $1 AND logged_at::date >= $2 AND logged_at::date <= $3`,
    [patientId, weekStart, weekEnd]
  );

  const exerciseData = exerciseResult.rows[0];

  // 5. Sleep logs: avg sleep hours (calculated from sleep_start and sleep_end)
  const sleepResult = await query(
    `SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (sleep_end - sleep_start)) / 3600), 0) AS avg_sleep_hours
     FROM sleep_logs
     WHERE patient_id = $1 AND logged_at::date >= $2 AND logged_at::date <= $3`,
    [patientId, weekStart, weekEnd]
  );

  const avgSleepHours = +parseFloat(sleepResult.rows[0].avg_sleep_hours).toFixed(1);

  // 6. Compose report_content
  const reportContent = {
    nutrition: {
      dailyCalories: mealDays.map((d: any) => ({
        date: d.log_date,
        calories: parseFloat(d.daily_calories),
      })),
      avgProtein: +avgProtein.toFixed(1),
      avgCarbs: +avgCarbs.toFixed(1),
      avgFat: +avgFat.toFixed(1),
    },
    weight: {
      startWeight,
      endWeight,
      change: weightChange,
    },
    water: {
      avgGlassesPerDay,
      dailyTarget: dailyWaterTarget,
      goalAdherencePercent: waterGoalAdherence,
    },
    exercise: {
      totalDurationMinutes: parseFloat(exerciseData.total_duration),
      totalCaloriesBurned: parseFloat(exerciseData.total_calories_burned),
    },
    sleep: {
      avgHours: avgSleepHours,
    },
  };

  // 7. Insert into ai_weekly_reports
  const insertResult = await query(
    `INSERT INTO ai_weekly_reports (patient_id, week_start, week_end, report_content)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [patientId, weekStart, weekEnd, JSON.stringify(reportContent)]
  );

  // 8. Return the report
  return insertResult.rows[0];
}

export async function getDailySummary(userId: string, date: string) {
  const patientId = await getPatientProfileId(userId);

  // Meals with totals
  const mealsResult = await query(
    `SELECT id, meal_type, total_calories, total_protein, total_carbs, total_fat, logged_at
     FROM meal_logs
     WHERE patient_id = $1 AND log_date = $2
     ORDER BY logged_at ASC`,
    [patientId, date]
  );

  const mealTotals = await query(
    `SELECT
       COALESCE(SUM(total_calories), 0) AS total_calories,
       COALESCE(SUM(total_protein), 0)  AS total_protein,
       COALESCE(SUM(total_carbs), 0)    AS total_carbs,
       COALESCE(SUM(total_fat), 0)      AS total_fat
     FROM meal_logs
     WHERE patient_id = $1 AND log_date = $2`,
    [patientId, date]
  );

  // Water intake
  const waterResult = await query(
    `SELECT COALESCE(SUM(glasses), 0) AS total_glasses
     FROM water_logs
     WHERE patient_id = $1 AND logged_at::date = $2`,
    [patientId, date]
  );

  // Exercise
  const exerciseResult = await query(
    `SELECT id, exercise_type, duration_min, calories_burned
     FROM exercise_logs
     WHERE patient_id = $1 AND logged_at::date = $2
     ORDER BY logged_at ASC`,
    [patientId, date]
  );

  // Weight if logged
  const weightResult = await query(
    `SELECT weight_kg FROM weight_logs
     WHERE patient_id = $1 AND measured_at::date = $2
     ORDER BY measured_at DESC LIMIT 1`,
    [patientId, date]
  );

  return {
    date,
    meals: mealsResult.rows,
    totals: mealTotals.rows[0],
    water: {
      glasses: parseFloat(waterResult.rows[0].total_glasses),
    },
    exercise: exerciseResult.rows,
    weight: weightResult.rows.length > 0 ? parseFloat(weightResult.rows[0].weight_kg) : null,
  };
}

export async function getPatientSummary(userId: string, targetPatientId?: string) {
  const patientId = targetPatientId || await getPatientProfileId(userId);

  // Total meals logged
  const totalMealsResult = await query(
    "SELECT COUNT(*) FROM meal_logs WHERE patient_id = $1",
    [patientId]
  );
  const totalMeals = parseInt(totalMealsResult.rows[0].count, 10);

  // Current streak (consecutive days with at least one meal log)
  const streakResult = await query(
    `WITH daily_logs AS (
       SELECT DISTINCT log_date
       FROM meal_logs
       WHERE patient_id = $1
       ORDER BY log_date DESC
     ),
     streaks AS (
       SELECT log_date,
              log_date - (ROW_NUMBER() OVER (ORDER BY log_date DESC))::int AS grp
       FROM daily_logs
     )
     SELECT COUNT(*) AS streak
     FROM streaks
     WHERE grp = (SELECT grp FROM streaks LIMIT 1)`,
    [patientId]
  );
  const currentStreak = parseInt(streakResult.rows[0]?.streak || "0", 10);

  // Weight change from start
  const firstWeightResult = await query(
    `SELECT weight_kg FROM weight_logs
     WHERE patient_id = $1
     ORDER BY measured_at ASC LIMIT 1`,
    [patientId]
  );
  const latestWeightResult = await query(
    `SELECT weight_kg FROM weight_logs
     WHERE patient_id = $1
     ORDER BY measured_at DESC LIMIT 1`,
    [patientId]
  );

  let weightChangeFromStart: number | null = null;
  if (firstWeightResult.rows.length > 0 && latestWeightResult.rows.length > 0) {
    weightChangeFromStart = +(
      parseFloat(latestWeightResult.rows[0].weight_kg) -
      parseFloat(firstWeightResult.rows[0].weight_kg)
    ).toFixed(2);
  }

  // Avg daily calories this week
  const avgCaloriesResult = await query(
    `SELECT COALESCE(AVG(daily_cal), 0) AS avg_daily_calories
     FROM (
       SELECT SUM(total_calories) AS daily_cal
       FROM meal_logs
       WHERE patient_id = $1
         AND log_date >= CURRENT_DATE - INTERVAL '7 days'
       GROUP BY log_date
     ) sub`,
    [patientId]
  );
  const avgDailyCalories = +parseFloat(avgCaloriesResult.rows[0].avg_daily_calories).toFixed(1);

  return {
    totalMeals,
    currentStreak,
    weightChangeFromStart,
    avgDailyCalories,
  };
}
