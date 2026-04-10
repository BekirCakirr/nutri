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

export async function getPhotos(userId: string) {
  const patientId = await getPatientProfileId(userId);

  const result = await query(
    `SELECT id, photo_url, photo_type, weight_at_time, notes, taken_at
     FROM progress_photos
     WHERE patient_id = $1
     ORDER BY taken_at DESC`,
    [patientId]
  );

  return result.rows;
}

export async function addPhoto(
  userId: string,
  input: {
    photoUrl: string;
    photoType?: string;
    weightAtTime?: number;
    notes?: string;
  }
) {
  const patientId = await getPatientProfileId(userId);

  const result = await query(
    `INSERT INTO progress_photos (patient_id, photo_url, photo_type, weight_at_time, notes)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      patientId,
      input.photoUrl,
      input.photoType || null,
      input.weightAtTime || null,
      input.notes || null,
    ]
  );

  return result.rows[0];
}

export async function deletePhoto(userId: string, photoId: string) {
  const patientId = await getPatientProfileId(userId);

  const result = await query(
    `DELETE FROM progress_photos WHERE id = $1 AND patient_id = $2 RETURNING id`,
    [photoId, patientId]
  );

  if (result.rows.length === 0) {
    throw Object.assign(new Error("Fotograf bulunamadi"), {
      statusCode: 404,
    });
  }

  return { deleted: true };
}
