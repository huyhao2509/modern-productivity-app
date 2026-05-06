import type {
  AiProjectPlannerInput,
  AiProjectPlannerResponse,
  AiProjectPlannerResponseV2,
  AiProjectMilestone,
  AiTaskSuggestion,
  AiTaskV2,
} from "../types/ai";

export function buildLocalPlanV2(input: AiProjectPlannerInput): AiProjectPlannerResponseV2 {
  // Demo dữ liệu mẫu, có thể random hoặc sinh động hơn nếu cần
  const goal = normalizeText(input.goal);
  const projectName = normalizeText(input.projectName ?? "") || deriveProjectName(goal);
  const description = normalizeText(input.description ?? "");

  const milestones: AiProjectMilestone[] = [
    {
      title: "Thiết kế Database",
      estimateDays: 2,
      priority: "high",
      tasks: [
        { title: "Phân tích yêu cầu dữ liệu", estimateDays: 1, priority: "high" },
        { title: "Thiết kế sơ đồ ERD", estimateDays: 1, priority: "medium" },
      ],
    },
    {
      title: "Phát triển Frontend",
      estimateDays: 5,
      priority: "medium",
      tasks: [
        { title: "Tạo giao diện trang chủ", estimateDays: 2, priority: "high" },
        { title: "Tạo trang sản phẩm", estimateDays: 2, priority: "medium" },
        { title: "Tích hợp API", estimateDays: 1, priority: "medium" },
      ],
    },
    {
      title: "Phát triển Backend",
      estimateDays: 4,
      priority: "medium",
      tasks: [
        { title: "Xây dựng API sản phẩm", estimateDays: 2, priority: "high" },
        { title: "Xây dựng API đơn hàng", estimateDays: 2, priority: "medium" },
      ],
    },
  ];

  return {
    engine: "rule-based",
    projectName,
    summary: description
      ? `Kế hoạch milestone cho ${goal}. ${description}`
      : `Kế hoạch milestone cho ${goal}.`,
    rationale: [
      "Chia nhỏ dự án thành các giai đoạn rõ ràng giúp dễ quản lý tiến độ.",
      "Ưu tiên các task quan trọng trước để đảm bảo giá trị cốt lõi.",
      "Có thể điều chỉnh estimate và priority theo thực tế.",
    ],
    milestones,
  };
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim();
const OPENAI_MODEL = process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini";
const OPENAI_API_URL = "https://api.openai.com/v1/responses";

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function capitalizeWords(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function deriveProjectName(goal: string): string {
  const words = normalizeText(goal)
    .replace(/[^\w\s-]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4);

  if (words.length === 0) {
    return "AI Productivity Planner";
  }

  return `${capitalizeWords(words.join(" "))} Planner`;
}

function inferPriority(title: string): AiTaskSuggestion["priority"] {
  const lowered = title.toLowerCase();

  if (/(define|scope|plan|architecture|research|audit|review)/.test(lowered)) {
    return "high";
  }

  if (/(build|implement|create|design|integrate|draft)/.test(lowered)) {
    return "medium";
  }

  return "low";
}

function buildLocalSuggestions(goal: string): AiTaskSuggestion[] {
  const lowerGoal = goal.toLowerCase();
  const suggestions: AiTaskSuggestion[] = [];

  const templates = [
    {
      title: "Clarify scope and success metrics",
      description: `Turn the idea "${normalizeText(goal)}" into a concrete outcome with clear users, inputs, and success criteria.`,
    },
    {
      title: "Design the core flow",
      description: "Map the main steps, screens, and data movement before building implementation details.",
    },
    {
      title: "Implement the primary workflow",
      description: "Build the minimum set of features that proves the product value end to end.",
    },
    {
      title: "Add validation and edge cases",
      description: "Handle empty states, invalid input, loading, and error scenarios before release.",
    },
    {
      title: "Polish the user experience",
      description: "Improve layout, microcopy, responsiveness, and demo readiness.",
    },
  ];

  if (lowerGoal.includes("research") || lowerGoal.includes("analy")) {
    templates.splice(1, 0, {
      title: "Collect reference data",
      description: "Gather the content, examples, or source material the AI should use as context.",
    });
  }

  if (lowerGoal.includes("team") || lowerGoal.includes("collabor")) {
    templates.splice(2, 0, {
      title: "Define collaboration roles",
      description: "Decide who can create, review, and approve the generated work items.",
    });
  }

  if (lowerGoal.includes("deploy") || lowerGoal.includes("ship")) {
    templates.push({
      title: "Prepare release checklist",
      description: "Verify build, environment variables, and deployment steps before publishing.",
    });
  }

  for (const template of templates.slice(0, 5)) {
    suggestions.push({
      ...template,
      priority: inferPriority(template.title),
    });
  }

  return suggestions;
}

function buildLocalRationale(goal: string): string[] {
  return [
    "Break the goal into deliverable slices so the plan is easier to execute.",
    `Keep the workflow centered on ${normalizeText(goal)} instead of generic task lists.`,
    "Use the planner output as a starting point, then refine it with your own constraints.",
  ];
}

function buildLocalPlan(input: AiProjectPlannerInput): AiProjectPlannerResponse {
  const goal = normalizeText(input.goal);
  const projectName = normalizeText(input.projectName ?? "") || deriveProjectName(goal);
  const description = normalizeText(input.description ?? "");

  return {
    engine: "rule-based",
    projectName,
    summary: description
      ? `A focused delivery plan for ${goal}. ${description}`
      : `A focused delivery plan for ${goal}.`,
    rationale: buildLocalRationale(goal),
    suggestions: buildLocalSuggestions(goal),
  };
}

function extractJsonBlock(content: string): string | null {
  const fencedMatch = content.match(/```json\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1];
  }

  const firstBrace = content.indexOf("{");
  const lastBrace = content.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return content.slice(firstBrace, lastBrace + 1);
  }

  return null;
}

async function buildOpenAiPlan(input: AiProjectPlannerInput): Promise<AiProjectPlannerResponse> {
  if (!OPENAI_API_KEY) {
    return buildLocalPlan(input);
  }

  const prompt = normalizeText(input.goal);
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: [
        {
          role: "system",
          content:
            "You are a productivity planning assistant. Return only valid JSON with keys engine, projectName, summary, rationale, and suggestions. suggestions must be an array of objects with title, description, and priority. priority must be low, medium, or high.",
        },
        {
          role: "user",
          content: `Project goal: ${prompt}\nProject name: ${input.projectName ?? ""}\nDescription: ${input.description ?? ""}`,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "project_plan",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              engine: { type: "string" },
              projectName: { type: "string" },
              summary: { type: "string" },
              rationale: {
                type: "array",
                items: { type: "string" },
              },
              suggestions: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    priority: { type: "string", enum: ["low", "medium", "high"] },
                  },
                  required: ["title", "description", "priority"],
                },
              },
            },
            required: ["engine", "projectName", "summary", "rationale", "suggestions"],
          },
        },
      },
    }),
  });

  if (!response.ok) {
    return buildLocalPlan(input);
  }

  const payload: unknown = await response.json();

  if (!payload || typeof payload !== "object" || !("output" in payload) || !Array.isArray((payload as { output?: unknown[] }).output)) {
    return buildLocalPlan(input);
  }

  for (const item of (payload as { output: unknown[] }).output) {
    if (!item || typeof item !== "object" || !("content" in item) || !Array.isArray((item as { content?: unknown[] }).content)) {
      continue;
    }

    for (const contentItem of (item as { content: unknown[] }).content) {
      if (!contentItem || typeof contentItem !== "object" || !("text" in contentItem) || typeof (contentItem as { text?: unknown }).text !== "string") {
        continue;
      }

      const jsonBlock = extractJsonBlock((contentItem as { text: string }).text);
      if (!jsonBlock) {
        continue;
      }

      try {
        const parsed = JSON.parse(jsonBlock) as AiProjectPlannerResponse;
        if (
          parsed &&
          typeof parsed === "object" &&
          typeof parsed.projectName === "string" &&
          typeof parsed.summary === "string" &&
          Array.isArray(parsed.rationale) &&
          Array.isArray(parsed.suggestions)
        ) {
          return {
            ...parsed,
            engine: "openai",
          };
        }
      } catch {
        return buildLocalPlan(input);
      }
    }
  }

  return buildLocalPlan(input);
}

export async function generateProjectPlan(
  input: AiProjectPlannerInput,
): Promise<AiProjectPlannerResponse> {
  if (!normalizeText(input.goal)) {
    throw new Error("Field 'goal' is required");
  }

  try {
    return await buildOpenAiPlan(input);
  } catch {
    return buildLocalPlan(input);
  }
}
