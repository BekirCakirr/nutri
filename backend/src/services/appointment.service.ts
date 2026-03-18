import { query, getClient } from "../config";

// ── Types ────────────────────────────────────────────────────────────────────

interface CreateAppointmentInput {
  patientId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  type: "online" | "in_person";
  notes?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function getDietitianProfileId(userId: string): Promise<string> {
  const result = await query(
    "SELECT id FROM dietitian_profiles WHERE user_id = $1",
    [userId]
  );
  if (result.rows.length === 0) {
    throw Object.assign(new Error("Diyetisyen profili bulunamadi"), {
      statusCode: 404,
    });
  }
  return result.rows[0].id;
}

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

export async function getAppointmentsByDietitian(
  userId: string,
  filters?: { status?: string; startDate?: string; endDate?: string }
) {
  const dietitianId = await getDietitianProfileId(userId);

  const conditions = ["a.dietitian_id = $1"];
  const values: any[] = [dietitianId];
  let paramIndex = 2;

  if (filters?.status) {
    conditions.push(`a.status = $${paramIndex++}`);
    values.push(filters.status);
  }
  if (filters?.startDate) {
    conditions.push(`a.appointment_date >= $${paramIndex++}`);
    values.push(filters.startDate);
  }
  if (filters?.endDate) {
    conditions.push(`a.appointment_date <= $${paramIndex++}`);
    values.push(filters.endDate);
  }

  const result = await query(
    `SELECT a.*,
            pp.first_name AS patient_first_name,
            pp.last_name AS patient_last_name,
            u.email AS patient_email
     FROM appointments a
     JOIN patient_profiles pp ON pp.id = a.patient_id
     JOIN users u ON u.id = pp.user_id
     WHERE ${conditions.join(" AND ")}
     ORDER BY a.appointment_date ASC, a.start_time ASC`,
    values
  );

  return result.rows;
}

export async function getAppointmentsByPatient(userId: string) {
  const patientId = await getPatientProfileId(userId);

  const result = await query(
    `SELECT a.*,
            dp.first_name AS dietitian_first_name,
            dp.last_name AS dietitian_last_name,
            dp.title AS dietitian_title,
            u.email AS dietitian_email
     FROM appointments a
     JOIN dietitian_profiles dp ON dp.id = a.dietitian_id
     JOIN users u ON u.id = dp.user_id
     WHERE a.patient_id = $1
     ORDER BY a.appointment_date ASC, a.start_time ASC`,
    [patientId]
  );

  return result.rows;
}

export async function getAppointmentById(id: string) {
  const result = await query(
    `SELECT a.*,
            dp.first_name AS dietitian_first_name,
            dp.last_name AS dietitian_last_name,
            dp.title AS dietitian_title,
            du.email AS dietitian_email,
            pp.first_name AS patient_first_name,
            pp.last_name AS patient_last_name,
            pu.email AS patient_email
     FROM appointments a
     JOIN dietitian_profiles dp ON dp.id = a.dietitian_id
     JOIN users du ON du.id = dp.user_id
     JOIN patient_profiles pp ON pp.id = a.patient_id
     JOIN users pu ON pu.id = pp.user_id
     WHERE a.id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    throw Object.assign(new Error("Randevu bulunamadi"), {
      statusCode: 404,
    });
  }

  return result.rows[0];
}

export async function createAppointment(
  userId: string,
  role: string,
  input: CreateAppointmentInput
) {
  const client = await getClient();
  try {
    await client.query("BEGIN");

    let dietitianId: string;

    if (role === "dietitian") {
      const dpResult = await client.query(
        "SELECT id FROM dietitian_profiles WHERE user_id = $1",
        [userId]
      );
      if (dpResult.rows.length === 0) {
        throw Object.assign(new Error("Diyetisyen profili bulunamadi"), {
          statusCode: 404,
        });
      }
      dietitianId = dpResult.rows[0].id;
    } else {
      throw Object.assign(
        new Error("Sadece diyetisyenler randevu olusturabilir"),
        { statusCode: 403 }
      );
    }

    // Verify patient exists
    const patientCheck = await client.query(
      "SELECT id FROM patient_profiles WHERE id = $1",
      [input.patientId]
    );
    if (patientCheck.rows.length === 0) {
      throw Object.assign(new Error("Hasta profili bulunamadi"), {
        statusCode: 404,
      });
    }

    // Check for overlapping appointments
    const overlapCheck = await client.query(
      `SELECT id FROM appointments
       WHERE dietitian_id = $1
         AND appointment_date = $2
         AND status NOT IN ('cancelled')
         AND (
           (start_time < $4 AND end_time > $3)
         )`,
      [dietitianId, input.appointmentDate, input.startTime, input.endTime]
    );

    if (overlapCheck.rows.length > 0) {
      throw Object.assign(
        new Error("Bu zaman diliminde zaten bir randevu bulunmaktadir"),
        { statusCode: 409 }
      );
    }

    // Generate Jitsi room ID for online appointments
    const jitsiRoomId =
      input.type === "online"
        ? `nutri-${dietitianId.slice(0, 8)}-${Date.now()}`
        : null;

    const result = await client.query(
      `INSERT INTO appointments (
        dietitian_id, patient_id, appointment_date,
        start_time, end_time, type, notes, jitsi_room_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        dietitianId,
        input.patientId,
        input.appointmentDate,
        input.startTime,
        input.endTime,
        input.type,
        input.notes || null,
        jitsiRoomId,
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

export async function updateAppointmentStatus(
  id: string,
  userId: string,
  status: string,
  notes?: string
) {
  // Verify appointment exists
  const existing = await query("SELECT * FROM appointments WHERE id = $1", [
    id,
  ]);

  if (existing.rows.length === 0) {
    throw Object.assign(new Error("Randevu bulunamadi"), {
      statusCode: 404,
    });
  }

  const appointment = existing.rows[0];

  // Verify the user is a participant (check both dietitian and patient profiles)
  const dietitianCheck = await query(
    "SELECT id FROM dietitian_profiles WHERE user_id = $1 AND id = $2",
    [userId, appointment.dietitian_id]
  );
  const patientCheck = await query(
    "SELECT id FROM patient_profiles WHERE user_id = $1 AND id = $2",
    [userId, appointment.patient_id]
  );

  if (dietitianCheck.rows.length === 0 && patientCheck.rows.length === 0) {
    throw Object.assign(
      new Error("Bu randevuyu guncelleme yetkiniz yok"),
      { statusCode: 403 }
    );
  }

  const fields: string[] = ["status = $1"];
  const values: any[] = [status];
  let paramIndex = 2;

  if (notes !== undefined) {
    if (dietitianCheck.rows.length > 0) {
      fields.push(`dietitian_notes = $${paramIndex++}`);
    } else {
      fields.push(`patient_notes = $${paramIndex++}`);
    }
    values.push(notes);
  }

  values.push(id);

  const result = await query(
    `UPDATE appointments SET ${fields.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  return result.rows[0];
}

export async function getAvailableSlots(dietitianId: string, date: string) {
  // Get dietitian's available hours and session duration
  const dpResult = await query(
    `SELECT available_hours, session_duration_min, available_days
     FROM dietitian_profiles
     WHERE id = $1`,
    [dietitianId]
  );

  if (dpResult.rows.length === 0) {
    throw Object.assign(new Error("Diyetisyen bulunamadi"), {
      statusCode: 404,
    });
  }

  const profile = dpResult.rows[0];
  const sessionDuration = profile.session_duration_min || 60;

  // Check if the day is in available_days
  const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
  }).toLowerCase();

  if (
    profile.available_days &&
    profile.available_days.length > 0 &&
    !profile.available_days.includes(dayOfWeek)
  ) {
    return [];
  }

  // Default working hours if no available_hours set
  const defaultStart = "09:00";
  const defaultEnd = "17:00";

  let workStart = defaultStart;
  let workEnd = defaultEnd;

  if (profile.available_hours) {
    workStart = profile.available_hours.start || defaultStart;
    workEnd = profile.available_hours.end || defaultEnd;
  }

  // Get existing appointments for the date
  const existingResult = await query(
    `SELECT start_time, end_time FROM appointments
     WHERE dietitian_id = $1
       AND appointment_date = $2
       AND status NOT IN ('cancelled')
     ORDER BY start_time ASC`,
    [dietitianId, date]
  );

  const booked = existingResult.rows.map((row: any) => ({
    start: row.start_time.slice(0, 5),
    end: row.end_time.slice(0, 5),
  }));

  // Generate all possible slots
  const slots: { startTime: string; endTime: string }[] = [];

  const toMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const toTime = (minutes: number) => {
    const h = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0");
    const m = (minutes % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  let current = toMinutes(workStart);
  const end = toMinutes(workEnd);

  while (current + sessionDuration <= end) {
    const slotStart = toTime(current);
    const slotEnd = toTime(current + sessionDuration);

    // Check if slot overlaps with any booked appointment
    const isBooked = booked.some(
      (b: { start: string; end: string }) =>
        toMinutes(b.start) < current + sessionDuration &&
        toMinutes(b.end) > current
    );

    if (!isBooked) {
      slots.push({ startTime: slotStart, endTime: slotEnd });
    }

    current += sessionDuration;
  }

  return slots;
}
