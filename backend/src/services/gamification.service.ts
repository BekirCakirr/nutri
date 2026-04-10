import { query } from "../config";

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

export async function getStatus(userId: string) {
  const patientId = await getPatientProfileId(userId);

  const profileResult = await query(
    `SELECT xp_points, level, current_streak
     FROM patient_profiles WHERE id = $1`,
    [patientId]
  );
  const profile = profileResult.rows[0];

  const badgeCountResult = await query(
    `SELECT COUNT(*)::int AS total FROM patient_badges WHERE patient_id = $1`,
    [patientId]
  );

  const xpToNextLevel = (profile.level + 1) * 100;

  return {
    level: profile.level,
    xp: profile.xp_points,
    xpToNextLevel,
    streak: profile.current_streak,
    totalBadges: badgeCountResult.rows[0].total,
  };
}

export async function getBadges(userId: string) {
  const patientId = await getPatientProfileId(userId);

  const result = await query(
    `SELECT b.id, b.name, b.description, b.icon, b.category,
            b.requirement_type, b.requirement_value, b.xp_reward,
            pb.earned_at,
            CASE WHEN pb.id IS NOT NULL THEN true ELSE false END AS earned
     FROM badges b
     LEFT JOIN patient_badges pb ON pb.badge_id = b.id AND pb.patient_id = $1
     WHERE b.is_active = true
     ORDER BY b.category, b.requirement_value`,
    [patientId]
  );

  return result.rows;
}

export async function getChallenges(userId: string) {
  const patientId = await getPatientProfileId(userId);

  const result = await query(
    `SELECT wc.id, wc.title, wc.description, wc.challenge_type,
            wc.target_value, wc.xp_reward, wc.start_date, wc.end_date,
            pc.current_progress, pc.is_completed, pc.completed_at, pc.joined_at
     FROM weekly_challenges wc
     LEFT JOIN patient_challenges pc ON pc.challenge_id = wc.id AND pc.patient_id = $1
     WHERE wc.end_date >= CURRENT_DATE
     ORDER BY wc.start_date`,
    [patientId]
  );

  return result.rows;
}
