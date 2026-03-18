import { query, getClient } from "../config";
import crypto from "crypto";

// ── Types ────────────────────────────────────────────────────────────────────

interface CreateShoppingListInput {
  title: string;
  mealPlanId?: string;
  items: {
    foodName: string;
    amount?: string;
    category?: string;
    allergenWarning?: boolean;
    estimatedPriceTl?: number;
    sortOrder?: number;
  }[];
}

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

function generateShareCode(): string {
  return crypto.randomBytes(10).toString("hex").slice(0, 20);
}

// ── Service Functions ────────────────────────────────────────────────────────

export async function getMyShoppingLists(userId: string) {
  const patientId = await getPatientProfileId(userId);

  const result = await query(
    `SELECT sl.*,
            COUNT(sli.id)::int AS item_count,
            COUNT(sli.id) FILTER (WHERE sli.is_checked = true)::int AS checked_count
     FROM shopping_lists sl
     LEFT JOIN shopping_list_items sli ON sli.shopping_list_id = sl.id
     WHERE sl.patient_id = $1
     GROUP BY sl.id
     ORDER BY sl.created_at DESC`,
    [patientId]
  );

  return result.rows;
}

export async function getShoppingListById(listId: string) {
  const listResult = await query(
    `SELECT * FROM shopping_lists WHERE id = $1`,
    [listId]
  );

  if (listResult.rows.length === 0) {
    throw Object.assign(new Error("Alisveris listesi bulunamadi"), {
      statusCode: 404,
    });
  }

  const itemsResult = await query(
    `SELECT * FROM shopping_list_items
     WHERE shopping_list_id = $1
     ORDER BY sort_order ASC, id ASC`,
    [listId]
  );

  return {
    ...listResult.rows[0],
    items: itemsResult.rows,
  };
}

export async function getShoppingListByShareCode(code: string) {
  const listResult = await query(
    `SELECT * FROM shopping_lists WHERE share_code = $1`,
    [code]
  );

  if (listResult.rows.length === 0) {
    throw Object.assign(new Error("Alisveris listesi bulunamadi"), {
      statusCode: 404,
    });
  }

  const itemsResult = await query(
    `SELECT * FROM shopping_list_items
     WHERE shopping_list_id = $1
     ORDER BY sort_order ASC, id ASC`,
    [listResult.rows[0].id]
  );

  return {
    ...listResult.rows[0],
    items: itemsResult.rows,
  };
}

export async function createShoppingList(
  userId: string,
  input: CreateShoppingListInput
) {
  const client = await getClient();
  try {
    await client.query("BEGIN");

    const patientId = await getPatientProfileId(userId);
    const shareCode = generateShareCode();

    // Calculate estimated total from items
    const estimatedTotalTl = input.items.reduce(
      (sum, item) => sum + (item.estimatedPriceTl || 0),
      0
    );

    // Insert shopping list
    const listResult = await client.query(
      `INSERT INTO shopping_lists (patient_id, meal_plan_id, title, share_code, estimated_total_tl)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        patientId,
        input.mealPlanId || null,
        input.title,
        shareCode,
        estimatedTotalTl > 0 ? estimatedTotalTl : null,
      ]
    );
    const list = listResult.rows[0];

    // Insert items
    const items = [];
    for (let i = 0; i < input.items.length; i++) {
      const item = input.items[i];
      const itemResult = await client.query(
        `INSERT INTO shopping_list_items (
          shopping_list_id, food_name, amount, category,
          allergen_warning, estimated_price_tl, sort_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
          list.id,
          item.foodName,
          item.amount || null,
          item.category || null,
          item.allergenWarning || false,
          item.estimatedPriceTl || null,
          item.sortOrder ?? i,
        ]
      );
      items.push(itemResult.rows[0]);
    }

    await client.query("COMMIT");

    return {
      ...list,
      items,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function toggleItem(itemId: string, userId: string) {
  const itemResult = await query(
    `SELECT sli.*, sl.patient_id
     FROM shopping_list_items sli
     JOIN shopping_lists sl ON sl.id = sli.shopping_list_id
     WHERE sli.id = $1`,
    [itemId]
  );

  if (itemResult.rows.length === 0) {
    throw Object.assign(new Error("Liste ogesi bulunamadi"), {
      statusCode: 404,
    });
  }

  const item = itemResult.rows[0];
  const newChecked = !item.is_checked;

  const result = await query(
    `UPDATE shopping_list_items
     SET is_checked = $1,
         checked_at = $2,
         checked_by = $3
     WHERE id = $4
     RETURNING *`,
    [
      newChecked,
      newChecked ? new Date().toISOString() : null,
      newChecked ? userId : null,
      itemId,
    ]
  );

  return result.rows[0];
}

export async function deleteShoppingList(listId: string, userId: string) {
  const patientId = await getPatientProfileId(userId);

  const existing = await query(
    `SELECT id FROM shopping_lists WHERE id = $1 AND patient_id = $2`,
    [listId, patientId]
  );
  if (existing.rows.length === 0) {
    throw Object.assign(
      new Error("Alisveris listesi bulunamadi veya erisim yetkiniz yok"),
      { statusCode: 404 }
    );
  }

  await query("DELETE FROM shopping_lists WHERE id = $1", [listId]);
}
