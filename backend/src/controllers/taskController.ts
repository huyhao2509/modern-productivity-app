import type { Request, Response } from "express";
import { createManyTasks, getAllTasks, getTaskById, updateTask, deleteTask } from "../services/taskService";
import type { CreateTaskInput, TaskPriority } from "../types/task";

interface CreateTasksBulkRequest {
  projectId: number;
  suggestions: Array<{
    title: string;
    description: string;
    priority: TaskPriority;
  }>;
}

const ALLOWED_PRIORITIES: TaskPriority[] = ["low", "medium", "high"];

function parseCreateTasksBulkInput(body: unknown): CreateTaskInput[] {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be an object");
  }

  const payload = body as Partial<CreateTasksBulkRequest>;

  if (typeof payload.projectId !== "number" || !Number.isInteger(payload.projectId) || payload.projectId < 1) {
    throw new Error("Field 'projectId' must be a positive integer");
  }

  if (!Array.isArray(payload.suggestions) || payload.suggestions.length === 0) {
    throw new Error("Field 'suggestions' must be a non-empty array");
  }

  return payload.suggestions.map((suggestion, index) => {
    const item = suggestion as Partial<CreateTasksBulkRequest["suggestions"][number]>;

    if (typeof item.title !== "string" || item.title.trim().length === 0) {
      throw new Error(`Suggestion #${index + 1}: field 'title' is required`);
    }

    if (typeof item.description !== "string" || item.description.trim().length === 0) {
      throw new Error(`Suggestion #${index + 1}: field 'description' is required`);
    }

    if (typeof item.priority !== "string" || !ALLOWED_PRIORITIES.includes(item.priority as TaskPriority)) {
      throw new Error(`Suggestion #${index + 1}: field 'priority' must be low, medium, or high`);
    }

    return {
      title: item.title.trim(),
      description: item.description.trim(),
      projectId: payload.projectId as number,
      priority: item.priority as TaskPriority,
      status: "todo",
    };
  });
}

export async function getTasks(_req: Request, res: Response): Promise<void> {
  try {
    const tasks = await getAllTasks();
    res.json(tasks);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch tasks";
    res.status(500).json({ message });
  }
}

export async function getTask(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ message: "Invalid task id" });
      return;
    }
    const task = await getTaskById(id);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch task" });
  }
}

export async function putTask(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ message: "Invalid task id" });
      return;
    }
    const data = req.body as Partial<CreateTaskInput>;
    if (!data.title && !data.description && !data.status && !data.priority && !data.dueDate) {
      res.status(400).json({ message: "No fields to update" });
      return;
    }
    const updated = await updateTask(id, data);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task" });
  }
}

export async function deleteTaskCtrl(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ message: "Invalid task id" });
      return;
    }
    await deleteTask(id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" });
  }
}

export async function postTasksBulk(req: Request, res: Response): Promise<void> {
  try {
    const inputList = parseCreateTasksBulkInput(req.body);
    const createdTasks = await createManyTasks(inputList);
    res.status(201).json(createdTasks);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request body";
    res.status(400).json({ message });
  }
}
