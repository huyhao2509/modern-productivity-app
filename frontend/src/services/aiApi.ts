import type { AiProjectPlannerInput, AiProjectPlannerResponseV2 } from "../types/ai";

const AI_API_URL = "/api/ai/project-plan";

function getErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== "object" || !("message" in data)) {
    return null;
  }

  const message = data.message;
  return typeof message === "string" ? message : null;
}

export async function generateProjectPlan(
  input: AiProjectPlannerInput,
): Promise<AiProjectPlannerResponseV2> {
  const response = await fetch(AI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data: unknown = await response.json();

  if (!response.ok) {
    const fallback = `Failed to generate AI plan: ${response.status}`;

    const message = getErrorMessage(data);
    if (message) {
      throw new Error(message);
    }

    throw new Error(fallback);
  }

  if (!data || typeof data !== "object") {
    throw new Error("Invalid AI API response");
  }

  return data as AiProjectPlannerResponseV2;
}
