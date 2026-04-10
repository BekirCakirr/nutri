import { Router } from "express";
import * as gamificationController from "../controllers/gamification.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.get("/status", authenticate, authorize("patient"), gamificationController.getStatus);
router.get("/badges", authenticate, authorize("patient"), gamificationController.getBadges);
router.get("/challenges", authenticate, authorize("patient"), gamificationController.getChallenges);

export default router;
