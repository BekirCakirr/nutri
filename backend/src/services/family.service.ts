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

export async function getMembers(userId: string) {
  const patientId = await getPatientProfileId(userId);

  const result = await query(
    `SELECT id, member_name, birth_date, relationship, allergen_ids, diet_notes, created_at
     FROM family_members
     WHERE owner_patient_id = $1
     ORDER BY created_at`,
    [patientId]
  );

  return result.rows;
}

export async function addMember(
  userId: string,
  input: {
    memberName: string;
    birthDate?: string;
    relationship?: string;
    allergenIds?: number[];
    dietNotes?: string;
  }
) {
  const patientId = await getPatientProfileId(userId);

  const result = await query(
    `INSERT INTO family_members (owner_patient_id, member_name, birth_date, relationship, allergen_ids, diet_notes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      patientId,
      input.memberName,
      input.birthDate || null,
      input.relationship || null,
      input.allergenIds || [],
      input.dietNotes || null,
    ]
  );

  return result.rows[0];
}

export async function removeMember(userId: string, memberId: string) {
  const patientId = await getPatientProfileId(userId);

  const result = await query(
    `DELETE FROM family_members WHERE id = $1 AND owner_patient_id = $2 RETURNING id`,
    [memberId, patientId]
  );

  if (result.rows.length === 0) {
    throw Object.assign(new Error("Aile uyesi bulunamadi"), {
      statusCode: 404,
    });
  }

  return { deleted: true };
}
