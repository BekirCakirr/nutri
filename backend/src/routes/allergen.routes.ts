import { Router } from "express";
import * as allergenController from "../controllers/allergen.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

// GET /api/allergens — list all allergens (any authenticated user)
router.get("/", authenticate, allergenController.getAllergens);

// POST /api/allergens — create allergen (admin/dietitian only)
router.post(
  "/",
  authenticate,
  authorize("admin", "dietitian"),
  allergenController.createAllergen
);

// PUT /api/allergens/:id — update allergen
router.put(
  "/:id",
  authenticate,
  authorize("admin", "dietitian"),
  allergenController.updateAllergen
);

// DELETE /api/allergens/:id — delete allergen (admin only)
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  allergenController.deleteAllergen
);

export default router;
