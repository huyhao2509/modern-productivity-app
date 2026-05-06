import type { BulkCreateTasksInput, Task } from "../types/task";

const TASKS_API_URL = "/api/tasks";

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${TASKS_API_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) {
    let msg = `Failed to delete task: ${response.status}`;
    try {
      const resData = await response.json();
      if (resData && typeof resData === "object" && "message" in resData && typeof resData.message === "string") {
        msg = resData.message;
      }
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
}

export async function createTasksBulk(input: BulkCreateTasksInput): Promise<Task[]> {
  const response = await fetch(`${TASKS_API_URL}/bulk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data: unknown = await response.json();

  if (!response.ok) {
    const fallback = `Failed to create tasks: ${response.status}`;

    if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
      throw new Error(data.message);
    }

    throw new Error(fallback);
  }

  if (!Array.isArray(data)) {
    throw new Error("Invalid API response: expected an array of tasks");
  }

  return data as Task[];
}
