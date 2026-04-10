import { Router } from "express";
import { z } from "zod";
import * as progressPhotoController from "../controllers/progress-photo.controller";
import { validate } from "../middleware/validate";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

const addPhotoSchema = z.object({
  photoUrl: z.string().min(1, "Foto URL gerekli"),
  photoType: z.enum(["front", "side", "back"]).optional(),
  weightAtTime: z.number().positive().optional(),
  notes: z.string().max(500).optional(),
});

router.get("/", authenticate, authorize("patient"), progressPhotoController.getPhotos);
router.post("/", authenticate, authorize("patient"), validate(addPhotoSchema), progressPhotoController.addPhoto);
router.delete("/:id", authenticate, authorize("patient"), progressPhotoController.deletePhoto);

export default router;
