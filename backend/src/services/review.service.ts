import { query, getClient } from "../config";

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

export async function getReviewsByDietitian(
  dietitianId: string,
  page: number = 1,
  limit: number = 10
) {
  const offset = (page - 1) * limit;

  const countResult = await query(
    "SELECT COUNT(*) FROM dietitian_reviews WHERE dietitian_id = $1",
    [dietitianId]
  );
  const total = parseInt(countResult.rows[0].count, 10);

  const result = await query(
    `SELECT dr.id,
            dr.dietitian_id,
            dr.patient_id,
            dr.rating,
            dr.comment,
            dr.is_anonymous,
            dr.created_at,
            CASE
              WHEN dr.is_anonymous = true THEN NULL
              ELSE pp.first_name
            END AS reviewer_first_name,
            CASE
              WHEN dr.is_anonymous = true THEN NULL
              ELSE pp.last_name
            END AS reviewer_last_name
     FROM dietitian_reviews dr
     JOIN patient_profiles pp ON pp.id = dr.patient_id
     WHERE dr.dietitian_id = $1
     ORDER BY dr.created_at DESC
     LIMIT $2 OFFSET $3`,
    [dietitianId, limit, offset]
  );

  return { reviews: result.rows, total, page, limit };
}

export async function createReview(
  userId: string,
  input: {
    dietitianId: string;
    rating: number;
    comment?: string;
    isAnonymous?: boolean;
  }
) {
  const client = await getClient();
  try {
    await client.query("BEGIN");

    // Resolve patient_id from user_id
    const patientResult = await client.query(
      "SELECT id FROM patient_profiles WHERE user_id = $1",
      [userId]
    );
    if (patientResult.rows.length === 0) {
      throw Object.assign(new Error("Hasta profili bulunamadi"), {
        statusCode: 404,
      });
    }
    const patientId = patientResult.rows[0].id;

    // Verify pairing exists
    const pairingCheck = await client.query(
      "SELECT id FROM dietitian_patients WHERE dietitian_id = $1 AND patient_id = $2",
      [input.dietitianId, patientId]
    );
    if (pairingCheck.rows.length === 0) {
      throw Object.assign(
        new Error("Bu diyetisyen ile eslestirmeniz bulunmamaktadir"),
        { statusCode: 403 }
      );
    }

    // Check for existing review (unique constraint)
    const existingCheck = await client.query(
      "SELECT id FROM dietitian_reviews WHERE dietitian_id = $1 AND patient_id = $2",
      [input.dietitianId, patientId]
    );
    if (existingCheck.rows.length > 0) {
      throw Object.assign(
        new Error("Bu diyetisyen icin zaten bir degerlendirmeniz bulunmaktadir"),
        { statusCode: 409 }
      );
    }

    // Insert review
    const result = await client.query(
      `INSERT INTO dietitian_reviews (dietitian_id, patient_id, rating, comment, is_anonymous)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        input.dietitianId,
        patientId,
        input.rating,
        input.comment || null,
        input.isAnonymous ?? false,
      ]
    );

    // Recalculate dietitian rating
    const statsResult = await client.query(
      `SELECT COUNT(*)::int AS rating_count, AVG(rating)::numeric(3,2) AS rating_avg
       FROM dietitian_reviews
       WHERE dietitian_id = $1`,
      [input.dietitianId]
    );

    await client.query(
      `UPDATE dietitian_profiles
       SET rating_avg = $1, rating_count = $2
       WHERE id = $3`,
      [
        statsResult.rows[0].rating_avg,
        statsResult.rows[0].rating_count,
        input.dietitianId,
      ]
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteReview(reviewId: string, userId: string) {
  const client = await getClient();
  try {
    await client.query("BEGIN");

    const patientId = await getPatientProfileId(userId);

    // Verify review exists and belongs to this patient
    const existing = await client.query(
      "SELECT * FROM dietitian_reviews WHERE id = $1",
      [reviewId]
    );

    if (existing.rows.length === 0) {
      throw Object.assign(new Error("Degerlendirme bulunamadi"), {
        statusCode: 404,
      });
    }

    const review = existing.rows[0];

    if (review.patient_id !== patientId) {
      throw Object.assign(
        new Error("Bu degerlendirmeyi silme yetkiniz yok"),
        { statusCode: 403 }
      );
    }

    await client.query("DELETE FROM dietitian_reviews WHERE id = $1", [
      reviewId,
    ]);

    // Recalculate dietitian rating
    const statsResult = await client.query(
      `SELECT COUNT(*)::int AS rating_count, COALESCE(AVG(rating)::numeric(3,2), 0) AS rating_avg
       FROM dietitian_reviews
       WHERE dietitian_id = $1`,
      [review.dietitian_id]
    );

    await client.query(
      `UPDATE dietitian_profiles
       SET rating_avg = $1, rating_count = $2
       WHERE id = $3`,
      [
        statsResult.rows[0].rating_avg,
        statsResult.rows[0].rating_count,
        review.dietitian_id,
      ]
    );

    await client.query("COMMIT");

    return { deleted: true };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
