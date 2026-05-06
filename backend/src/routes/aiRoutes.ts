import { Router } from "express";
import { postProjectPlan } from "../controllers/aiController";

const router = Router();

router.post("/project-plan", postProjectPlan);

export default router;
