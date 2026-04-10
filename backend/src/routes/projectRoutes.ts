import { Router } from "express";
import { getProjects, postProject } from "../controllers/projectController";

const router = Router();

router.get("/", getProjects);
router.post("/", postProject);

export default router;
