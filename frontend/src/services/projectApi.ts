
import type { NewProjectInput, Project } from "../types/project";

const PROJECTS_API_URL = "/api/projects";

export async function fetchProjects(): Promise<Project[]> {
  const response = await fetch(PROJECTS_API_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.status}`);
  }
  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Invalid API response: expected an array of projects");
  }
  return data as Project[];
}

export async function createProject(input: NewProjectInput): Promise<Project> {
  const response = await fetch(PROJECTS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });
  const data: unknown = await response.json();
  if (!response.ok) {
    const fallback = `Failed to create project: ${response.status}`;
    if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
      throw new Error(data.message);
    }
    throw new Error(fallback);
  }
  return data as Project;
}

export async function updateProject(id: number, data: { name?: string; description?: string }): Promise<Project> {
  const response = await fetch(`${PROJECTS_API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  const resData: unknown = await response.json();
  if (!response.ok) {
    const fallback = `Failed to update project: ${response.status}`;
    if (resData && typeof resData === "object" && "message" in resData && typeof resData.message === "string") {
      throw new Error(resData.message);
    }
    throw new Error(fallback);
  }
  return resData as Project;
}

export async function deleteProject(id: number): Promise<void> {
  const response = await fetch(`${PROJECTS_API_URL}/${id}`, { method: "DELETE", cache: "no-store" });
  if (!response.ok) {
    let msg = `Failed to delete project: ${response.status}`;
    try {
      const resData = await response.json();
      if (resData && typeof resData === "object" && "message" in resData && typeof resData.message === "string") {
        msg = resData.message;
      }
    } catch (error) {
      void error;
    }
    throw new Error(msg);
  }
}
