import type { NewProjectInput, Project } from "../types/project";

const PROJECTS_API_URL = "http://localhost:4000/api/projects";

export async function fetchProjects(): Promise<Project[]> {
  const response = await fetch(PROJECTS_API_URL);

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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data: unknown = await response.json();

  if (!response.ok) {
    const fallback = `Failed to create project: ${response.status}`;

    if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
      throw new Error(data.message);
    }

    throw new Error(fallback);
  }

  if (!data || typeof data !== "object") {
    throw new Error("Invalid API response: expected a project object");
  }

  return data as Project;
}
