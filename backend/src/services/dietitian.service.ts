import { query, getClient } from "../config";
import { generateInviteCode } from "../utils";

interface UpdateDietitianProfileInput {
  title?: string;
  specializations?: string[];
  bio?: string;
  clinic_name?: string;
  clinic_address?: string;
  city?: string;
  offers_online?: boolean;
  offers_in_person?: boolean;
  session_price_tl?: number;
  available_days?: string[];
  session_duration_min?: number;
  profile_photo_url?: string;
}

export async function getMyProfile(userId: string) {
  const result = await query(
    `SELECT dp.*, u.email
     FROM dietitian_profiles dp
     JOIN users u ON u.id = dp.user_id
     WHERE dp.user_id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw Object.assign(new Error("Diyetisyen profili bulunamadi"), {
      statusCode: 404,
    });
  }

  return result.rows[0];
}

export async function updateMyProfile(
  userId: string,
  input: UpdateDietitianProfileInput
) {
  const allowedFields = [
    "title",
    "specializations",
    "bio",
    "clinic_name",
    "clinic_address",
    "city",
    "offers_online",
    "offers_in_person",
    "session_price_tl",
    "available_days",
    "session_duration_min",
    "profile_photo_url",
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
    `UPDATE dietitian_profiles
     SET ${setClauses.join(", ")}
     WHERE user_id = $${paramIndex}
     RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw Object.assign(new Error("Diyetisyen profili bulunamadi"), {
      statusCode: 404,
    });
  }

  return result.rows[0];
}

export async function getDietitianById(profileId: string) {
  const result = await query(
    `SELECT dp.*, u.email
     FROM dietitian_profiles dp
     JOIN users u ON u.id = dp.user_id
     WHERE dp.id = $1`,
    [profileId]
  );

  if (result.rows.length === 0) {
    throw Object.assign(new Error("Diyetisyen bulunamadi"), {
      statusCode: 404,
    });
  }

  return result.rows[0];
}

export async function getMyPatients(userId: string) {
  const result = await query(
    `SELECT pp.*, u.email
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

export async function pairWithPatient(
  patientUserId: string,
  inviteCode: string
) {
  const client = await getClient();
  try {
    await client.query("BEGIN");

    // Find dietitian by invite code
    const dtResult = await client.query(
      `SELECT id, first_name, last_name, title, clinic_name, city
       FROM dietitian_profiles
       WHERE invite_code = $1 AND is_approved = true`,
      [inviteCode.toUpperCase()]
    );

    if (dtResult.rows.length === 0) {
      throw Object.assign(
        new Error("Gecersiz veya onaylanmamis diyetisyen kodu"),
        { statusCode: 400 }
      );
    }

    const dietitian = dtResult.rows[0];

    // Get patient profile id
    const patientResult = await client.query(
      `SELECT id FROM patient_profiles WHERE user_id = $1`,
      [patientUserId]
    );

    if (patientResult.rows.length === 0) {
      throw Object.assign(new Error("Hasta profili bulunamadi"), {
        statusCode: 404,
      });
    }

    const patientProfileId = patientResult.rows[0].id;

    // Check for existing active pairing
    const existingPairing = await client.query(
      `SELECT id FROM dietitian_patients
       WHERE dietitian_id = $1 AND patient_id = $2 AND status = 'active'`,
      [dietitian.id, patientProfileId]
    );

    if (existingPairing.rows.length > 0) {
      throw Object.assign(
        new Error("Bu diyetisyen ile zaten aktif bir eslestirmeniz var"),
        { statusCode: 409 }
      );
    }

    // Create pairing
    await client.query(
      `INSERT INTO dietitian_patients (dietitian_id, patient_id, status, paired_via)
       VALUES ($1, $2, 'active', 'invite_code')`,
      [dietitian.id, patientProfileId]
    );

    // Update patient usage mode
    await client.query(
      `UPDATE patient_profiles SET usage_mode = 'with_dietitian', updated_at = NOW()
       WHERE id = $1`,
      [patientProfileId]
    );

    await client.query("COMMIT");

    return dietitian;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getMyInviteCode(userId: string) {
  const result = await query(
    `SELECT invite_code FROM dietitian_profiles WHERE user_id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw Object.assign(new Error("Diyetisyen profili bulunamadi"), {
      statusCode: 404,
    });
  }

  return result.rows[0].invite_code;
}

export async function regenerateInviteCode(userId: string) {
  // Get dietitian first name for code generation
  const profile = await query(
    `SELECT first_name FROM dietitian_profiles WHERE user_id = $1`,
    [userId]
  );

  if (profile.rows.length === 0) {
    throw Object.assign(new Error("Diyetisyen profili bulunamadi"), {
      statusCode: 404,
    });
  }

  let newCode = generateInviteCode(profile.rows[0].first_name);
  let codeExists = true;
  let attempts = 0;

  while (codeExists && attempts < 10) {
    const check = await query(
      "SELECT id FROM dietitian_profiles WHERE invite_code = $1",
      [newCode]
    );
    codeExists = check.rows.length > 0;
    if (codeExists) {
      newCode = generateInviteCode(profile.rows[0].first_name);
      attempts++;
    }
  }

  const result = await query(
    `UPDATE dietitian_profiles
     SET invite_code = $1, updated_at = NOW()
     WHERE user_id = $2
     RETURNING invite_code`,
    [newCode, userId]
  );

  return result.rows[0].invite_code;
}
