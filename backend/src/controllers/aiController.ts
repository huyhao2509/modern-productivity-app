import type { Request, Response } from "express";
import { buildLocalPlanV2 } from "../services/aiPlannerService";
import type { AiProjectPlannerInput } from "../types/ai";

function parseAiProjectPlannerInput(body: unknown): AiProjectPlannerInput {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be an object");
  }

  const { goal, projectName, description } = body as Partial<AiProjectPlannerInput>;

  if (typeof goal !== "string" || goal.trim().length === 0) {
    throw new Error("Field 'goal' is required");
  }

  return {
    goal: goal.trim(),
    projectName: typeof projectName === "string" ? projectName.trim() : undefined,
    description: typeof description === "string" ? description.trim() : undefined,
  };
}

export async function postProjectPlan(req: Request, res: Response): Promise<void> {
  try {
    const input = parseAiProjectPlannerInput(req.body);
    const planV2 = buildLocalPlanV2(input);
    res.json(planV2);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request body";
    res.status(400).json({ message });
  }
}
