import type { Request, Response } from "express";
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject } from "../services/projectService";
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

export async function getProjects(_req: Request, res: Response): Promise<void> {
  try {
    const projects = await getAllProjects();
    res.json(projects);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch projects";
    res.status(500).json({ message });
  }
}

export async function postProject(req: Request, res: Response): Promise<void> {
  try {
    const input = parseCreateProjectInput(req.body);
    const project = await createProject(input);
    res.status(201).json(project);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request body";
    res.status(400).json({ message });
  }
}

export async function getProject(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ message: "Invalid project id" });
      return;
    }
    const project = await getProjectById(id);
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch project" });
  }
}

export async function putProject(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ message: "Invalid project id" });
      return;
    }
    const data = req.body as Partial<{ name: string; description: string }>;
    if (!data.name && !data.description) {
      res.status(400).json({ message: "No fields to update" });
      return;
    }
    const updated = await updateProject(id, data);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update project" });
  }
}

export async function deleteProjectCtrl(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ message: "Invalid project id" });
      return;
    }
    await deleteProject(id);
    res.json({ message: "Project deleted" });
  } catch (error: any) {
    // Prisma throws error with code 'P2025' if record not found
    if (error && typeof error === "object" && error.code === "P2025") {
      res.status(404).json({ message: "Project not found" });
    } else {
      res.status(500).json({ message: "Failed to delete project" });
    }
  }
}
