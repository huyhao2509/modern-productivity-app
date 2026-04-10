import { Router } from "express";
import { getProjects, postProject, removeProject } from "../controllers/projectController";

const router = Router();

router.get("/", getProjects);
router.post("/", postProject);
router.delete("/:id", removeProject);

export default router;
