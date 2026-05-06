import { Router } from "express";
import { getTasks, postTasksBulk, getTask, putTask, deleteTaskCtrl } from "../controllers/taskController";

const router = Router();

router.get("/", getTasks);
router.post("/bulk", postTasksBulk);

router.get("/:id", getTask);
router.put("/:id", putTask);
router.delete("/:id", deleteTaskCtrl);

export default router;
