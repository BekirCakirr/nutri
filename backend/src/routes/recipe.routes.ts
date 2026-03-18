import { Router } from "express";
import { z } from "zod";
import * as recipeController from "../controllers/recipe.controller";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/auth";

const router = Router();

// ── Validation schemas ───────────────────────────────────────────────────────

const createRecipeSchema = z.object({
  name: z.string().min(1, "Tarif adi gerekli").max(200),
  description: z.string().optional(),
  instructions: z.string().optional(),
  prep_time_min: z.number().int().min(0).optional(),
  cook_time_min: z.number().int().min(0).optional(),
  servings: z.number().int().min(1).optional(),
  calories_per_serving: z.number().min(0).optional(),
  protein_per_serving: z.number().min(0).optional(),
  carbs_per_serving: z.number().min(0).optional(),
  fat_per_serving: z.number().min(0).optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  allergen_ids: z.array(z.number().int()).optional(),
  image_url: z.string().url().optional(),
  ingredients: z.any().optional(),
  tags: z.array(z.string()).optional(),
  season: z.array(z.string()).optional(),
  estimated_cost_tl: z.number().min(0).optional(),
  is_ai_generated: z.boolean().optional(),
  is_budget_friendly: z.boolean().optional(),
});

const updateRecipeSchema = createRecipeSchema.partial();

// ── Routes ───────────────────────────────────────────────────────────────────

router.get("/", authenticate, recipeController.searchRecipes);

router.get("/:id", authenticate, recipeController.getRecipeById);

router.post(
  "/",
  authenticate,
  authorize("dietitian", "admin"),
  validate(createRecipeSchema),
  recipeController.createRecipe
);

router.put(
  "/:id",
  authenticate,
  authorize("dietitian", "admin"),
  validate(updateRecipeSchema),
  recipeController.updateRecipe
);

export default router;
