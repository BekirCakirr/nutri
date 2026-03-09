import { Router } from "express";
import { z } from "zod";
import * as foodController from "../controllers/food.controller";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/auth";

const router = Router();

// ── Validation schemas ───────────────────────────────────────────────────────

const createFoodSchema = z.object({
  name: z.string().min(1, "Besin adi gerekli").max(200),
  name_en: z.string().max(200).optional(),
  category: z.string().min(1, "Kategori gerekli").max(100),
  calories_per_100g: z.number().min(0, "Kalori 0 veya daha buyuk olmali"),
  protein_per_100g: z.number().min(0, "Protein 0 veya daha buyuk olmali"),
  carbs_per_100g: z.number().min(0, "Karbonhidrat 0 veya daha buyuk olmali"),
  fat_per_100g: z.number().min(0, "Yag 0 veya daha buyuk olmali"),
  fiber_per_100g: z.number().min(0).optional(),
  sugar_per_100g: z.number().min(0).optional(),
  sodium_per_100g: z.number().min(0).optional(),
  serving_size_g: z.number().min(0).optional(),
  serving_description: z.string().max(100).optional(),
  barcode: z.string().max(50).optional(),
  image_url: z.string().url().optional(),
  allergen_ids: z.array(z.number().int()).optional(),
});

const updateFoodSchema = createFoodSchema.partial();

// ── Routes ───────────────────────────────────────────────────────────────────

router.get("/", authenticate, foodController.searchFoods);

router.get("/barcode/:code", authenticate, foodController.getFoodByBarcode);

router.get("/:id", authenticate, foodController.getFoodById);

router.post(
  "/",
  authenticate,
  authorize("dietitian", "admin"),
  validate(createFoodSchema),
  foodController.createFood
);

router.put(
  "/:id",
  authenticate,
  authorize("dietitian", "admin"),
  validate(updateFoodSchema),
  foodController.updateFood
);

export default router;
