import { query, getClient } from "../config";

// ── Types ────────────────────────────────────────────────────────────────────

interface SendMessageInput {
  conversationId?: string;
  receiverId?: string;
  content: string;
  messageType?: string;
  attachmentUrl?: string;
  metadata?: any;
}

// ── Service Functions ────────────────────────────────────────────────────────

export async function getOrCreateConversation(
  userId1: string,
  userId2: string
) {
  // Validate both users exist
  const userCheck = await query(
    `SELECT id FROM users WHERE id = $1`,
    [userId2]
  );
  if (userCheck.rows.length === 0) {
    throw Object.assign(new Error("Alici bulunamadi"), { statusCode: 400 });
  }

  // Find existing conversation between two users
  const existing = await query(
    `SELECT cp1.conversation_id
     FROM conversation_participants cp1
     JOIN conversation_participants cp2
       ON cp1.conversation_id = cp2.conversation_id
     WHERE cp1.user_id = $1 AND cp2.user_id = $2
     LIMIT 1`,
    [userId1, userId2]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0].conversation_id;
  }

  // Create new conversation with both participants
  const client = await getClient();
  try {
    await client.query("BEGIN");

    const convResult = await client.query(
      `INSERT INTO conversations DEFAULT VALUES RETURNING *`
    );
    const conversationId = convResult.rows[0].id;

    await client.query(
      `INSERT INTO conversation_participants (conversation_id, user_id)
       VALUES ($1, $2), ($1, $3)`,
      [conversationId, userId1, userId2]
    );

    await client.query("COMMIT");
    return conversationId;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getConversations(userId: string) {
  const result = await query(
    `SELECT
       c.id,
       c.created_at,
       c.updated_at,
       u.id AS other_user_id,
       u.email AS other_user_email,
       COALESCE(pp.first_name, dp.first_name) AS other_user_first_name,
       COALESCE(pp.last_name, dp.last_name) AS other_user_last_name,
       u.role AS other_user_role,
       COALESCE(pp.profile_photo_url, dp.profile_photo_url) AS other_user_avatar,
       pp.id AS other_patient_profile_id,
       dp.id AS other_dietitian_profile_id,
       lm.id AS last_message_id,
       lm.content AS last_message_content,
       lm.message_type AS last_message_type,
       lm.sender_id AS last_message_sender_id,
       lm.created_at AS last_message_at,
       COALESCE(unread.count, 0)::int AS unread_count
     FROM conversations c
     JOIN conversation_participants cp ON cp.conversation_id = c.id AND cp.user_id = $1
     JOIN conversation_participants cp2 ON cp2.conversation_id = c.id AND cp2.user_id != $1
     JOIN users u ON u.id = cp2.user_id
     LEFT JOIN patient_profiles pp ON pp.user_id = u.id
     LEFT JOIN dietitian_profiles dp ON dp.user_id = u.id
     LEFT JOIN LATERAL (
       SELECT m.id, m.content, m.message_type, m.sender_id, m.created_at
       FROM messages m
       WHERE m.conversation_id = c.id
       ORDER BY m.created_at DESC
       LIMIT 1
     ) lm ON true
     LEFT JOIN LATERAL (
       SELECT COUNT(*) AS count
       FROM messages m
       WHERE m.conversation_id = c.id
         AND m.sender_id != $1
         AND m.is_read = false
     ) unread ON true
     ORDER BY COALESCE(lm.created_at, c.created_at) DESC`,
    [userId]
  );

  return result.rows;
}

export async function getMessages(
  conversationId: string,
  userId: string,
  page: number = 1,
  limit: number = 50
) {
  // Verify user is a participant
  const participant = await query(
    `SELECT id FROM conversation_participants
     WHERE conversation_id = $1 AND user_id = $2`,
    [conversationId, userId]
  );

  if (participant.rows.length === 0) {
    throw Object.assign(new Error("Bu konusmaya erisim yetkiniz yok"), {
      statusCode: 403,
    });
  }

  const offset = (page - 1) * limit;

  const countResult = await query(
    `SELECT COUNT(*) AS total FROM messages WHERE conversation_id = $1`,
    [conversationId]
  );
  const total = parseInt(countResult.rows[0].total, 10);

  const messagesResult = await query(
    `SELECT m.*,
            COALESCE(pp.first_name, dp.first_name) AS sender_first_name,
            COALESCE(pp.last_name, dp.last_name) AS sender_last_name,
            COALESCE(pp.profile_photo_url, dp.profile_photo_url) AS sender_avatar
     FROM messages m
     JOIN users u ON u.id = m.sender_id
     LEFT JOIN patient_profiles pp ON pp.user_id = u.id
     LEFT JOIN dietitian_profiles dp ON dp.user_id = u.id
     WHERE m.conversation_id = $1
     ORDER BY m.created_at DESC
     LIMIT $2 OFFSET $3`,
    [conversationId, limit, offset]
  );

  return {
    messages: messagesResult.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function sendMessage(userId: string, input: SendMessageInput) {
  let conversationId = input.conversationId;

  if (!conversationId && !input.receiverId) {
    throw Object.assign(
      new Error("conversationId veya receiverId belirtilmeli"),
      { statusCode: 400 }
    );
  }

  // If receiverId provided, find or create conversation
  if (!conversationId && input.receiverId) {
    conversationId = await getOrCreateConversation(userId, input.receiverId);
  }

  // Verify user is a participant
  const participant = await query(
    `SELECT id FROM conversation_participants
     WHERE conversation_id = $1 AND user_id = $2`,
    [conversationId, userId]
  );

  if (participant.rows.length === 0) {
    throw Object.assign(new Error("Bu konusmaya erisim yetkiniz yok"), {
      statusCode: 403,
    });
  }

  // Find the other participant as receiver
  const otherParticipant = await query(
    `SELECT user_id FROM conversation_participants
     WHERE conversation_id = $1 AND user_id != $2
     LIMIT 1`,
    [conversationId, userId]
  );
  const receiverId = otherParticipant.rows.length > 0
    ? otherParticipant.rows[0].user_id
    : null;

  const result = await query(
    `INSERT INTO messages (conversation_id, sender_id, receiver_id, message_type, content, attachment_url, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      conversationId,
      userId,
      receiverId,
      input.messageType || "text",
      input.content,
      input.attachmentUrl || null,
      input.metadata ? JSON.stringify(input.metadata) : null,
    ]
  );

  // Update conversation updated_at
  await query(
    `UPDATE conversations SET updated_at = NOW() WHERE id = $1`,
    [conversationId]
  );

  return result.rows[0];
}

export async function markAsRead(conversationId: string, userId: string) {
  // Verify user is a participant
  const participant = await query(
    `SELECT id FROM conversation_participants
     WHERE conversation_id = $1 AND user_id = $2`,
    [conversationId, userId]
  );

  if (participant.rows.length === 0) {
    throw Object.assign(new Error("Bu konusmaya erisim yetkiniz yok"), {
      statusCode: 403,
    });
  }

  const result = await query(
    `UPDATE messages
     SET is_read = true, read_at = NOW()
     WHERE conversation_id = $1
       AND sender_id != $2
       AND is_read = false
     RETURNING id`,
    [conversationId, userId]
  );

  return { markedCount: result.rows.length };
}
