import type { Request, Response } from "express";
import { getAllTasks } from "../services/taskService";

export function getTasks(_req: Request, res: Response): void {
  res.json(getAllTasks());
}
