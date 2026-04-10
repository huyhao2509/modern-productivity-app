import { Router } from "express";
import { projects } from "../data/projects";
import type { CreateProjectInput } from "../types/project";

const router = Router();

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

router.get("/", (_req, res) => {
  res.json(projects);
});

router.post("/", (req, res) => {
  try {
    const input = parseCreateProjectInput(req.body);
    const nextId = Math.max(0, ...projects.map((project) => project.id)) + 1;

    const newProject = {
      id: nextId,
      name: input.name,
      description: input.description,
    };

    projects.push(newProject);
    res.status(201).json(newProject);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request body";
    res.status(400).json({ message });
  }
});

export default router;
