import { Router } from "express";
import { getProjects, postProject, getProject, putProject, deleteProjectCtrl } from "../controllers/projectController";

const router = Router();

router.get("/", getProjects);
router.post("/", postProject);

router.get("/:id", getProject);
router.put("/:id", putProject);
router.delete("/:id", deleteProjectCtrl);

export default router;
