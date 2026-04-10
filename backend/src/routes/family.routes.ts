import { Router } from "express";
import { z } from "zod";
import * as familyController from "../controllers/family.controller";
import { validate } from "../middleware/validate";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

const addMemberSchema = z.object({
  memberName: z.string().min(1, "Isim gerekli").max(100),
  birthDate: z.string().optional(),
  relationship: z.enum(["cocuk", "es", "ebeveyn"]).optional(),
  allergenIds: z.array(z.number().int()).optional(),
  dietNotes: z.string().max(500).optional(),
});

router.get("/members", authenticate, authorize("patient"), familyController.getMembers);
router.post("/members", authenticate, authorize("patient"), validate(addMemberSchema), familyController.addMember);
router.delete("/members/:id", authenticate, authorize("patient"), familyController.removeMember);

export default router;
