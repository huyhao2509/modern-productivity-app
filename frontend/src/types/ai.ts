export interface AiTaskV2 {
  title: string;
  estimateDays: number;
  priority: "low" | "medium" | "high";
}

export interface AiProjectMilestone {
  title: string;
  estimateDays: number;
  priority: "low" | "medium" | "high";
  tasks: AiTaskV2[];
}

export interface AiProjectPlannerResponseV2 {
  engine: "rule-based" | "openai";
  projectName: string;
  summary: string;
  rationale: string[];
  milestones: AiProjectMilestone[];
}
export interface AiProjectPlannerInput {
  goal: string;
  projectName?: string | undefined;
  description?: string | undefined;
}

export interface AiTaskSuggestion {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
}

export interface AiProjectPlannerResponse {
  engine: "rule-based" | "openai";
  projectName: string;
  summary: string;
  rationale: string[];
  suggestions: AiTaskSuggestion[];
}
