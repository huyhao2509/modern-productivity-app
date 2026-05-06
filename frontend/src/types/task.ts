export type TaskPriority = "low" | "medium" | "high";

export interface NewTaskSuggestionInput {
  title: string;
  description: string;
  priority: TaskPriority;
}

export interface BulkCreateTasksInput {
  projectId: number;
  suggestions: NewTaskSuggestionInput[];
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  dueDate: string;
  projectId: number;
  priority: TaskPriority;
}
