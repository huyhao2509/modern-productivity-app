import type { Request, Response } from "express";
import { createProject, deleteProjectById, getAllProjects } from "../services/projectService";
import type { CreateProjectInput } from "../types/project";

function parseCreateProjectInput(body: unknown): CreateProjectInput {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be an object");
  }

  const { name, description } = body as Partial<CreateProjectInput>;

  if (typeof name !== "string" || name.trim().length === 0) {
    throw new Error("Field 'name' is required");
  }

  if (typeof description !== "string" || description.trim().length === 0) {
    throw new Error("Field 'description' is required");
  }

  return {
    name: name.trim(),
    description: description.trim(),
  };
}

export function getProjects(_req: Request, res: Response): void {
  res.json(getAllProjects());
}

export function postProject(req: Request, res: Response): void {
  try {
    const input = parseCreateProjectInput(req.body);
    const project = createProject(input);
    res.status(201).json(project);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request body";
    res.status(400).json({ message });
  }
}

export function removeProject(req: Request, res: Response): void {
  const projectId = Number(req.params.id);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    res.status(400).json({ message: "Project id must be a positive integer" });
    return;
  }

  const deleted = deleteProjectById(projectId);

  if (!deleted) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  res.status(204).send();
}
