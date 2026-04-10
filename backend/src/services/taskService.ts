import { tasks } from "../data/tasks";
import type { Task } from "../types/task";

export function getAllTasks(): Task[] {
  return tasks;
}
