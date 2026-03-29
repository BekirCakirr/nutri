import { Request, Response, NextFunction } from "express";
import { pool } from "../config";
import { sendSuccess, sendError } from "../utils";

export async function getAllergens(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { rows } = await pool.query(`
      SELECT a.*,
        COALESCE(pa.patient_count, 0) AS affected_patients
      FROM allergens a
      LEFT JOIN (
        SELECT allergen_id, COUNT(DISTINCT patient_id)::int AS patient_count
        FROM patient_allergies
        GROUP BY allergen_id
      ) pa ON pa.allergen_id = a.id
      ORDER BY a.id
    `);
    sendSuccess({ res, data: { allergens: rows, total: rows.length } });
  } catch (err: any) {
    next(err);
  }
}

export async function createAllergen(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, name_en, category, icon, description } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO allergens (name, name_en, category, icon, description)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, name_en, category || "food_allergen", icon, description]
    );
    sendSuccess({ res, data: rows[0], message: "Alerjen eklendi", statusCode: 201 });
  } catch (err: any) {
    next(err);
  }
}

export async function updateAllergen(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(String(req.params.id), 10);
    const { name, name_en, category, icon, description } = req.body;
    const { rows } = await pool.query(
      `UPDATE allergens SET
        name = COALESCE($1, name),
        name_en = COALESCE($2, name_en),
        category = COALESCE($3, category),
        icon = COALESCE($4, icon),
        description = COALESCE($5, description)
       WHERE id = $6 RETURNING *`,
      [name, name_en, category, icon, description, id]
    );
    if (rows.length === 0) {
      sendError({ res, message: "Alerjen bulunamadi", statusCode: 404 });
      return;
    }
    sendSuccess({ res, data: rows[0], message: "Alerjen guncellendi" });
  } catch (err: any) {
    next(err);
  }
}

export async function deleteAllergen(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(String(req.params.id), 10);
    const { rowCount } = await pool.query("DELETE FROM allergens WHERE id = $1", [id]);
    if (rowCount === 0) {
      sendError({ res, message: "Alerjen bulunamadi", statusCode: 404 });
      return;
    }
    sendSuccess({ res, data: { deleted: true }, message: "Alerjen silindi" });
  } catch (err: any) {
    next(err);
  }
}
