import { Router } from "express";
import { tasks } from "../data/tasks";

const router = Router();

router.get("/", (_req, res) => {
  res.json(tasks);
});

export default router;
