import { projects } from "../data/projects";
import type { CreateProjectInput, Project } from "../types/project";

export function getAllProjects(): Project[] {
  return projects;
}

export function createProject(input: CreateProjectInput): Project {
  const nextId = Math.max(0, ...projects.map((project) => project.id)) + 1;

  const newProject: Project = {
    id: nextId,
    name: input.name,
    description: input.description,
  };

  projects.push(newProject);
  return newProject;
}
