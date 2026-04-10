import type { Project } from "../types/project";

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
