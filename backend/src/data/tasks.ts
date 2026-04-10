import { Task } from "../types/task";

export const tasks: Task[] = [
  {
    id: 1,
    title: "Set up backend structure",
    description: "Initialize Express app and core middleware for API development.",
    status: "done",
    dueDate: "2026-04-10",
    projectId: 1,
    priority: "high",
  },
  {
    id: 2,
    title: "Build projects API",
    description: "Create project endpoints and return hard-coded demo data.",
    status: "in_progress",
    dueDate: "2026-04-12",
    projectId: 2,
    priority: "medium",
  },
  {
    id: 3,
    title: "Design tasks page UI",
    description: "Draft responsive task cards and loading/error states in frontend.",
    status: "todo",
    dueDate: "2026-04-15",
    projectId: 3,
    priority: "medium",
  },
  {
    id: 4,
    title: "Write API integration notes",
    description: "Document endpoint contracts for frontend consumption.",
    status: "todo",
    dueDate: "2026-04-18",
    projectId: 1,
    priority: "low",
  },
];
