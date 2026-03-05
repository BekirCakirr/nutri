import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { query, getClient, env } from "../config";
import { JwtPayload } from "../middleware";
import { generateInviteCode } from "../utils";

const SALT_ROUNDS = 10;

interface RegisterPatientInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  inviteCode?: string;
}

interface RegisterDietitianInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  title?: string;
  licenseNumber: string;
  specializations?: string[];
  university?: string;
  experienceYears?: number;
  bio?: string;
  city?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResult {
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

function generateTokens(payload: JwtPayload) {
  const accessToken = jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtAccessExpiresIn,
  });
  const refreshToken = jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn,
  });
  return { accessToken, refreshToken, expiresIn: 900 }; // 15 min in seconds
}

export async function registerPatient(
  input: RegisterPatientInput
): Promise<AuthResult> {
  const client = await getClient();
  try {
    await client.query("BEGIN");

    // Check existing email
    const existing = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [input.email]
    );
    if (existing.rows.length > 0) {
      throw Object.assign(new Error("Bu e-posta adresi zaten kullaniliyor"), {
        statusCode: 409,
      });
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    // Create user
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, role, is_active, is_verified)
       VALUES ($1, $2, 'patient', true, false)
       RETURNING id, email, role`,
      [input.email, passwordHash]
    );
    const user = userResult.rows[0];

    // Determine usage mode
    let usageMode = "ai_independent";
    let dietitianProfileId: string | null = null;

    if (input.inviteCode) {
      const dtResult = await client.query(
        `SELECT id FROM dietitian_profiles WHERE invite_code = $1 AND is_approved = true`,
        [input.inviteCode.toUpperCase()]
      );
      if (dtResult.rows.length === 0) {
        throw Object.assign(new Error("Gecersiz diyetisyen kodu"), {
          statusCode: 400,
        });
      }
      dietitianProfileId = dtResult.rows[0].id;
      usageMode = "with_dietitian";
    }

    // Create patient profile
    const profileResult = await client.query(
      `INSERT INTO patient_profiles (user_id, first_name, last_name, usage_mode)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [user.id, input.firstName, input.lastName, usageMode]
    );

    // Pair with dietitian if invite code provided
    if (dietitianProfileId) {
      await client.query(
        `INSERT INTO dietitian_patients (dietitian_id, patient_id, status, paired_via)
         VALUES ($1, $2, 'active', 'invite_code')`,
        [dietitianProfileId, profileResult.rows[0].id]
      );
    }

    await client.query("COMMIT");

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token
    await storeRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: input.firstName,
        lastName: input.lastName,
      },
      ...tokens,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function registerDietitian(
  input: RegisterDietitianInput
): Promise<AuthResult> {
  const client = await getClient();
  try {
    await client.query("BEGIN");

    const existing = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [input.email]
    );
    if (existing.rows.length > 0) {
      throw Object.assign(new Error("Bu e-posta adresi zaten kullaniliyor"), {
        statusCode: 409,
      });
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, role, is_active, is_verified)
       VALUES ($1, $2, 'dietitian', true, false)
       RETURNING id, email, role`,
      [input.email, passwordHash]
    );
    const user = userResult.rows[0];

    // Generate unique invite code
    let inviteCode = generateInviteCode(input.firstName);
    let codeExists = true;
    let attempts = 0;
    while (codeExists && attempts < 10) {
      const check = await client.query(
        "SELECT id FROM dietitian_profiles WHERE invite_code = $1",
        [inviteCode]
      );
      codeExists = check.rows.length > 0;
      if (codeExists) {
        inviteCode = generateInviteCode(input.firstName);
        attempts++;
      }
    }

    await client.query(
      `INSERT INTO dietitian_profiles (
        user_id, first_name, last_name, title, license_number,
        specializations, university, experience_years, bio, city,
        invite_code, is_approved
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, false)`,
      [
        user.id,
        input.firstName,
        input.lastName,
        input.title || null,
        input.licenseNumber,
        input.specializations || [],
        input.university || null,
        input.experienceYears || null,
        input.bio || null,
        input.city || null,
        inviteCode,
      ]
    );

    await client.query("COMMIT");

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await storeRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: input.firstName,
        lastName: input.lastName,
      },
      ...tokens,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const result = await query(
    "SELECT id, email, password_hash, role FROM users WHERE email = $1 AND is_active = true",
    [input.email]
  );

  if (result.rows.length === 0) {
    throw Object.assign(new Error("E-posta veya sifre hatali"), {
      statusCode: 401,
    });
  }

  const user = result.rows[0];
  const validPassword = await bcrypt.compare(input.password, user.password_hash);
  if (!validPassword) {
    throw Object.assign(new Error("E-posta veya sifre hatali"), {
      statusCode: 401,
    });
  }

  // Get profile name
  let firstName = "";
  let lastName = "";

  if (user.role === "patient") {
    const profile = await query(
      "SELECT first_name, last_name FROM patient_profiles WHERE user_id = $1",
      [user.id]
    );
    if (profile.rows.length > 0) {
      firstName = profile.rows[0].first_name;
      lastName = profile.rows[0].last_name;
    }
  } else if (user.role === "dietitian") {
    const profile = await query(
      "SELECT first_name, last_name FROM dietitian_profiles WHERE user_id = $1",
      [user.id]
    );
    if (profile.rows.length > 0) {
      firstName = profile.rows[0].first_name;
      lastName = profile.rows[0].last_name;
    }
  } else {
    firstName = "Admin";
    lastName = "";
  }

  // Update last login
  await query("UPDATE users SET last_login_at = NOW() WHERE id = $1", [
    user.id,
  ]);

  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  await storeRefreshToken(user.id, tokens.refreshToken);

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName,
      lastName,
    },
    ...tokens,
  };
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
  // Verify the refresh token
  let payload: JwtPayload;
  try {
    payload = jwt.verify(refreshToken, env.jwtRefreshSecret) as JwtPayload;
  } catch {
    throw Object.assign(new Error("Gecersiz refresh token"), {
      statusCode: 401,
    });
  }

  // Check if token exists in DB
  const stored = await query(
    "SELECT id FROM refresh_tokens WHERE token = $1 AND user_id = $2 AND expires_at > NOW()",
    [refreshToken, payload.userId]
  );
  if (stored.rows.length === 0) {
    throw Object.assign(new Error("Refresh token bulunamadi veya suresi dolmus"), {
      statusCode: 401,
    });
  }

  // Delete old token
  await query("DELETE FROM refresh_tokens WHERE token = $1", [refreshToken]);

  // Issue new tokens
  const tokens = generateTokens({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  });

  await storeRefreshToken(payload.userId, tokens.refreshToken);

  return tokens;
}

export async function getProfile(userId: string, role: string) {
  if (role === "patient") {
    const result = await query(
      `SELECT pp.*, u.email
       FROM patient_profiles pp
       JOIN users u ON u.id = pp.user_id
       WHERE pp.user_id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  }

  if (role === "dietitian") {
    const result = await query(
      `SELECT dp.*, u.email
       FROM dietitian_profiles dp
       JOIN users u ON u.id = dp.user_id
       WHERE dp.user_id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  }

  return null;
}

async function storeRefreshToken(userId: string, token: string) {
  // Expires in 7 days
  await query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
    [userId, token]
  );

  // Clean up old tokens for this user (keep max 5)
  await query(
    `DELETE FROM refresh_tokens
     WHERE user_id = $1 AND id NOT IN (
       SELECT id FROM refresh_tokens WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5
     )`,
    [userId]
  );
}
