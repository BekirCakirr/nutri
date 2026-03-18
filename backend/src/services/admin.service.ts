import { query } from "../config";

// ── Dashboard Stats ─────────────────────────────────────────────────────────

export async function getDashboardStats() {
  // Total users
  const totalUsersResult = await query("SELECT COUNT(*) FROM users");
  const totalUsers = parseInt(totalUsersResult.rows[0].count, 10);

  // Total patients
  const totalPatientsResult = await query(
    "SELECT COUNT(*) FROM users WHERE role = 'patient'"
  );
  const totalPatients = parseInt(totalPatientsResult.rows[0].count, 10);

  // Total dietitians
  const totalDietitiansResult = await query(
    "SELECT COUNT(*) FROM users WHERE role = 'dietitian'"
  );
  const totalDietitians = parseInt(totalDietitiansResult.rows[0].count, 10);

  // Total meals logged
  const totalMealsResult = await query("SELECT COUNT(*) FROM meal_logs");
  const totalMealsLogged = parseInt(totalMealsResult.rows[0].count, 10);

  // Total appointments
  const totalAppointmentsResult = await query(
    "SELECT COUNT(*) FROM appointments"
  );
  const totalAppointments = parseInt(
    totalAppointmentsResult.rows[0].count,
    10
  );

  // Active patients (logged in last 7 days with role=patient)
  const activePatientsResult = await query(
    `SELECT COUNT(*) FROM users
     WHERE role = 'patient'
       AND last_login_at >= NOW() - INTERVAL '7 days'`
  );
  const activePatients = parseInt(activePatientsResult.rows[0].count, 10);

  // Pending dietitian approvals
  const pendingApprovalsResult = await query(
    "SELECT COUNT(*) FROM dietitian_profiles WHERE is_approved = false"
  );
  const pendingDietitianApprovals = parseInt(
    pendingApprovalsResult.rows[0].count,
    10
  );

  // Recent signups (last 7 days, count by role)
  const recentSignupsResult = await query(
    `SELECT role, COUNT(*) AS count
     FROM users
     WHERE created_at >= NOW() - INTERVAL '7 days'
     GROUP BY role`
  );
  const recentSignups = recentSignupsResult.rows.map((row: any) => ({
    role: row.role,
    count: parseInt(row.count, 10),
  }));

  return {
    totalUsers,
    totalPatients,
    totalDietitians,
    totalMealsLogged,
    totalAppointments,
    activePatients,
    pendingDietitianApprovals,
    recentSignups,
  };
}

// ── Users ───────────────────────────────────────────────────────────────────

interface GetUsersFilters {
  role?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getUsers(filters: GetUsersFilters = {}) {
  const { role, isActive, search, page = 1, limit = 20 } = filters;
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (role) {
    conditions.push(`u.role = $${paramIndex}`);
    values.push(role);
    paramIndex++;
  }

  if (isActive !== undefined) {
    conditions.push(`u.is_active = $${paramIndex}`);
    values.push(isActive);
    paramIndex++;
  }

  if (search) {
    conditions.push(
      `(u.email ILIKE $${paramIndex}
        OR pp.first_name ILIKE $${paramIndex}
        OR pp.last_name ILIKE $${paramIndex}
        OR dp.first_name ILIKE $${paramIndex}
        OR dp.last_name ILIKE $${paramIndex})`
    );
    values.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Count total
  const countResult = await query(
    `SELECT COUNT(DISTINCT u.id)
     FROM users u
     LEFT JOIN patient_profiles pp ON pp.user_id = u.id
     LEFT JOIN dietitian_profiles dp ON dp.user_id = u.id
     ${whereClause}`,
    values
  );
  const total = parseInt(countResult.rows[0].count, 10);

  // Fetch paginated users
  const usersResult = await query(
    `SELECT
       u.id, u.email, u.role, u.is_active, u.created_at, u.last_login_at,
       COALESCE(pp.first_name, dp.first_name) AS first_name,
       COALESCE(pp.last_name, dp.last_name) AS last_name
     FROM users u
     LEFT JOIN patient_profiles pp ON pp.user_id = u.id
     LEFT JOIN dietitian_profiles dp ON dp.user_id = u.id
     ${whereClause}
     ORDER BY u.created_at DESC
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...values, limit, offset]
  );

  return {
    users: usersResult.rows,
    total,
    page,
    limit,
  };
}

// ── User by ID ──────────────────────────────────────────────────────────────

export async function getUserById(userId: string) {
  const userResult = await query(
    "SELECT id, email, role, is_active, created_at, last_login_at FROM users WHERE id = $1",
    [userId]
  );

  if (userResult.rows.length === 0) {
    throw Object.assign(new Error("Kullanici bulunamadi"), {
      statusCode: 404,
    });
  }

  const user = userResult.rows[0];

  // Fetch profile based on role
  let profile = null;
  if (user.role === "patient") {
    const profileResult = await query(
      "SELECT * FROM patient_profiles WHERE user_id = $1",
      [userId]
    );
    profile = profileResult.rows[0] || null;
  } else if (user.role === "dietitian") {
    const profileResult = await query(
      "SELECT * FROM dietitian_profiles WHERE user_id = $1",
      [userId]
    );
    profile = profileResult.rows[0] || null;
  }

  return { ...user, profile };
}

// ── User Status ─────────────────────────────────────────────────────────────

export async function updateUserStatus(userId: string, isActive: boolean) {
  const result = await query(
    `UPDATE users
     SET is_active = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, email, role, is_active, updated_at`,
    [isActive, userId]
  );

  if (result.rows.length === 0) {
    throw Object.assign(new Error("Kullanici bulunamadi"), {
      statusCode: 404,
    });
  }

  return result.rows[0];
}

// ── Dietitian Approval ──────────────────────────────────────────────────────

export async function approveDietitian(dietitianProfileId: string) {
  const result = await query(
    `UPDATE dietitian_profiles
     SET is_approved = true, approval_date = NOW(), updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [dietitianProfileId]
  );

  if (result.rows.length === 0) {
    throw Object.assign(new Error("Diyetisyen profili bulunamadi"), {
      statusCode: 404,
    });
  }

  return result.rows[0];
}

export async function rejectDietitian(
  dietitianProfileId: string,
  reason: string
) {
  const result = await query(
    `UPDATE dietitian_profiles
     SET is_approved = false, rejected_reason = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [reason, dietitianProfileId]
  );

  if (result.rows.length === 0) {
    throw Object.assign(new Error("Diyetisyen profili bulunamadi"), {
      statusCode: 404,
    });
  }

  return result.rows[0];
}

// ── Audit Log ───────────────────────────────────────────────────────────────

export async function getAuditLog(page: number = 1, limit: number = 50) {
  // Return empty array if admin_audit_log table does not exist yet
  try {
    const offset = (page - 1) * limit;

    const countResult = await query("SELECT COUNT(*) FROM admin_audit_log");
    const total = parseInt(countResult.rows[0].count, 10);

    const logsResult = await query(
      `SELECT * FROM admin_audit_log
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return {
      logs: logsResult.rows,
      total,
      page,
      limit,
    };
  } catch {
    return {
      logs: [],
      total: 0,
      page,
      limit,
    };
  }
}
