export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  projectId: number;
  priority: TaskPriority;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  projectId: number;
  priority: TaskPriority;
  status?: TaskStatus | undefined;
  dueDate?: string | undefined;
}
