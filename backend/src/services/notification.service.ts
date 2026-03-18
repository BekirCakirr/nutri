import { query } from "../config";

// ── Types ────────────────────────────────────────────────────────────────────

interface CreateNotificationInput {
  userId: string;
  type: string;
  title: string;
  body?: string;
  data?: any;
}

// ── Service Functions ────────────────────────────────────────────────────────

export async function getNotifications(
  userId: string,
  page: number = 1,
  limit: number = 20,
  unreadOnly: boolean = false
) {
  const offset = (page - 1) * limit;

  const whereClause = unreadOnly
    ? `WHERE user_id = $1 AND is_read = false`
    : `WHERE user_id = $1`;

  const countResult = await query(
    `SELECT COUNT(*) AS total FROM notifications ${whereClause}`,
    [userId]
  );
  const total = parseInt(countResult.rows[0].total, 10);

  const unreadResult = await query(
    `SELECT COUNT(*) AS count FROM notifications
     WHERE user_id = $1 AND is_read = false`,
    [userId]
  );
  const unreadCount = parseInt(unreadResult.rows[0].count, 10);

  const notificationsResult = await query(
    `SELECT * FROM notifications
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return {
    notifications: notificationsResult.rows,
    total,
    unreadCount,
    page,
    limit,
  };
}

export async function getUnreadCount(userId: string) {
  const result = await query(
    `SELECT COUNT(*) AS count FROM notifications
     WHERE user_id = $1 AND is_read = false`,
    [userId]
  );

  return { unreadCount: parseInt(result.rows[0].count, 10) };
}

export async function markAsRead(notificationId: string, userId: string) {
  const result = await query(
    `UPDATE notifications
     SET is_read = true
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [notificationId, userId]
  );

  if (result.rows.length === 0) {
    throw Object.assign(new Error("Bildirim bulunamadi"), {
      statusCode: 404,
    });
  }

  return result.rows[0];
}

export async function markAllAsRead(userId: string) {
  const result = await query(
    `UPDATE notifications
     SET is_read = true
     WHERE user_id = $1 AND is_read = false
     RETURNING id`,
    [userId]
  );

  return { markedCount: result.rows.length };
}

export async function createNotification(input: CreateNotificationInput) {
  const result = await query(
    `INSERT INTO notifications (user_id, type, title, body, data)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      input.userId,
      input.type,
      input.title,
      input.body || null,
      input.data ? JSON.stringify(input.data) : null,
    ]
  );

  return result.rows[0];
}

export async function deleteNotification(
  notificationId: string,
  userId: string
) {
  const result = await query(
    `DELETE FROM notifications
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [notificationId, userId]
  );

  if (result.rows.length === 0) {
    throw Object.assign(
      new Error("Bildirim bulunamadi veya silme yetkiniz yok"),
      { statusCode: 404 }
    );
  }

  return { deleted: true };
}
