import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { generateProjectPlan } from "../services/aiApi";
import { createProject, fetchProjects, updateProject, deleteProject } from "../services/projectApi";
import EditProjectModal from "../components/EditProjectModal";
import { createTasksBulk } from "../services/taskApi";
import type { AiProjectPlannerResponseV2 } from "../types/ai";
import type { Project } from "../types/project";
import "./ProjectsPage.css";

const PROJECT_TONES = ["mint", "sun", "ocean"] as const;

function getProjectTone(id: number): (typeof PROJECT_TONES)[number] {
  const toneIndex = (id - 1) % PROJECT_TONES.length;
  return PROJECT_TONES[toneIndex] ?? PROJECT_TONES[0];
}

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [goal, setGoal] = useState("Build an AI-powered productivity feature for my portfolio");
  const [projectNameHint, setProjectNameHint] = useState("");
  const [goalDescription, setGoalDescription] = useState(
    "Turn the idea into a polished feature I can show in interviews.",
  );
  const [planning, setPlanning] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [planSuccess, setPlanSuccess] = useState<string | null>(null);
  const [savingPlan, setSavingPlan] = useState(false);
  const [plan, setPlan] = useState<AiProjectPlannerResponseV2 | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const projectList = await fetchProjects();
        setProjects(projectList);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setProjectError(message);
      } finally {
        setLoading(false);
      }
    }

    void loadProjects();
  }, []);

  async function handleCreateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !description.trim()) {
      setProjectError("Name and description are required");
      return;
    }

    try {
      setCreating(true);
      setProjectError(null);

      const newProject = await createProject({
        name: name.trim(),
        description: description.trim(),
      });

      setProjects((current) => [...current, newProject]);
      setName("");
      setDescription("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setProjectError(message);
    } finally {
      setCreating(false);
    }
  }

  async function handleGeneratePlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!goal.trim()) {
      setPlanError("Describe the goal you want the AI to plan for");
      return;
    }

    try {
      setPlanning(true);
      setPlanError(null);
      setPlanSuccess(null);

      const result = await generateProjectPlan({
        goal: goal.trim(),
        projectName: projectNameHint.trim() || undefined,
        description: goalDescription.trim() || undefined,
      });

      setPlan(result);
      setName(result.projectName);
      setDescription(result.summary);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setPlanError(message);
    } finally {
      setPlanning(false);
    }
  }

  async function handleCreateProjectWithPlan(): Promise<void> {
    if (!plan) {
      return;
    }

    try {
      setSavingPlan(true);
      setPlanError(null);
      setPlanSuccess(null);

      const createdProject = await createProject({
        name: plan.projectName,
        description: plan.summary,
      });

      const taskSuggestions = plan.milestones.flatMap((milestone) =>
        milestone.tasks.map((task) => ({
          title: task.title,
          description: `Milestone: ${milestone.title} — khoảng ${task.estimateDays} ngày.`,
          priority: task.priority,
        })),
      );

      await createTasksBulk({
        projectId: createdProject.id,
        suggestions: taskSuggestions,
      });

      setProjects((current) => [...current, createdProject]);
      setName("");
      setDescription("");
      setPlanSuccess(
        `Created project #${createdProject.id} with ${taskSuggestions.length} AI tasks.`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setPlanError(message);
    } finally {
      setSavingPlan(false);
    }
  }

  return (
    <main className="projects-page">
      <header className="projects-page__hero">
        <p className="projects-page__eyebrow">Workspace Overview</p>
        <h1>Projects</h1>
        <p className="projects-page__subtitle">
          A quick view of active initiatives synced from your backend API.
        </p>
      </header>

      <section className="project-form-section" aria-label="Create project">
        <h2>Create Project</h2>
        <form className="project-form" onSubmit={handleCreateProject}>
          <label className="project-form__field">
            <span>Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex: Mobile Planner"
              disabled={creating}
            />
          </label>

          <label className="project-form__field">
            <span>Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what this project is about"
              rows={3}
              disabled={creating}
            />
          </label>

          <button type="submit" disabled={creating}>
            {creating ? "Creating..." : "Create project"}
          </button>
        </form>
      </section>

      <section className="ai-planner-section" aria-label="AI project planner">
        <div className="ai-planner-section__header">
          <div>
            <p className="ai-planner-section__eyebrow">AI Assistant</p>
            <h2>Generate a project plan</h2>
          </div>
          <p className="ai-planner-section__subtitle">
            Turn a rough idea into a structured plan, suggested tasks, and a cleaner project title.
          </p>
        </div>

        <form className="ai-planner-form" onSubmit={handleGeneratePlan}>
          <label className="ai-planner-form__field">
            <span>Goal</span>
            <textarea
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              placeholder="Example: Build a portfolio feature that plans weekly tasks with AI"
              rows={3}
              disabled={planning}
            />
          </label>

          <label className="ai-planner-form__field">
            <span>Optional project name</span>
            <input
              type="text"
              value={projectNameHint}
              onChange={(event) => setProjectNameHint(event.target.value)}
              placeholder="Example: AI Sprint Planner"
              disabled={planning}
            />
          </label>

          <label className="ai-planner-form__field">
            <span>Optional context</span>
            <textarea
              value={goalDescription}
              onChange={(event) => setGoalDescription(event.target.value)}
              placeholder="Add more context for the AI planner"
              rows={2}
              disabled={planning}
            />
          </label>

          <button type="submit" disabled={planning}>
            {planning ? "Generating..." : "Generate plan"}
          </button>
        </form>

        {planError && <p className="ai-planner-section__status ai-planner-section__status--error">{planError}</p>}

        {plan && (
          <div className="ai-plan-card">
            <div className="ai-plan-card__head">
              <div>
                <p className="ai-plan-card__eyebrow">{plan.engine === "openai" ? "OpenAI plan" : "Local AI fallback"}</p>
                <h3>{plan.projectName}</h3>
              </div>
              <div className="ai-plan-card__actions">
                <button
                  type="button"
                  className="ai-plan-card__apply"
                  onClick={() => {
                    setName(plan.projectName);
                    setDescription(plan.summary);
                  }}
                  disabled={savingPlan}
                >
                  Apply to project form
                </button>
                <button
                  type="button"
                  className="ai-plan-card__save"
                  onClick={() => {
                    void handleCreateProjectWithPlan();
                  }}
                  disabled={savingPlan}
                >
                  {savingPlan ? "Saving..." : "Create project + save AI tasks"}
                </button>
              </div>
            </div>

            {planSuccess && (
              <p className="ai-planner-section__status ai-planner-section__status--success">
                {planSuccess}
              </p>
            )}

            <p className="ai-plan-card__summary">{plan.summary}</p>

            <div className="ai-plan-card__grid">
              <div className="ai-plan-card__block">
                <h4>Why this plan</h4>
                <ul>
                  {plan.rationale.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="ai-plan-card__block">
                <h4>Milestones & Tasks</h4>
                {plan.milestones.length > 0 ? (
                  <ul className="ai-plan-card__milestones">
                    {plan.milestones.map((milestone, idx) => (
                      <li key={`${milestone.title}-${idx}`} className="ai-milestone">
                        <div className="ai-milestone__header">
                          <span className="ai-milestone__title">{milestone.title}</span>
                          <span className="ai-milestone__meta">
                            <span className={`ai-milestone__priority ai-milestone__priority--${milestone.priority}`}>{milestone.priority}</span>
                            <span className="ai-milestone__estimate">{milestone.estimateDays} days</span>
                          </span>
                        </div>
                        <ul className="ai-milestone__tasks">
                          {milestone.tasks.map((task, tIdx) => (
                            <li key={`${task.title}-${tIdx}`} className="ai-task">
                              <span className="ai-task__title">{task.title}</span>
                              <span className="ai-task__meta">
                                <span className={`ai-task__priority ai-task__priority--${task.priority}`}>{task.priority}</span>
                                <span className="ai-task__estimate">{task.estimateDays}d</span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No milestones found.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {loading && <p className="projects-page__status">Loading projects...</p>}

      {projectError && (
        <p className="projects-page__status projects-page__status--error">
          Could not load projects: {projectError}
        </p>
      )}

      {!loading && !projectError && (
        <ul className="projects-grid" aria-label="Project list">
          {projects.map((project) => {
            const tone = getProjectTone(project.id);
            const isEditing = editingId === project.id;
            const isDeleting = deletingId === project.id;
            return (
              <li key={project.id} className={`project-card project-card--${tone}`}>
                <div className="project-card__head">
                  <span className="project-card__badge">Project #{project.id}</span>
                  <div style={{ float: "right", display: "flex", gap: 8 }}>
                    <button
                      aria-label="Edit project"
                      onClick={() => {
                        setEditingId(project.id);
                        setEditError(null);
                      }}
                      style={{ fontSize: 14 }}
                      disabled={isEditing || isDeleting}
                    >✏️</button>
                    <button
                      aria-label="Delete project"
                      onClick={() => {
                        setDeletingId(project.id);
                        setDeleteError(null);
                      }}
                      style={{ fontSize: 14 }}
                      disabled={isEditing || isDeleting}
                    >🗑️</button>
                  </div>
                </div>

                {isDeleting ? (
                  <div style={{ marginTop: 8 }}>
                    <p>Bạn có chắc muốn xoá project này?</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={async () => {
                          try {
                            setDeleteError(null);
                            await deleteProject(project.id);
                            setProjects((prev) => prev.filter((p) => p.id !== project.id));
                            setDeletingId(null);
                          } catch (err) {
                            // Nếu lỗi là 404 (project không tồn tại), vẫn xoá khỏi UI
                            const msg = err instanceof Error ? err.message : "Delete failed";
                            if (msg.includes("404") || msg.toLowerCase().includes("not found")) {
                              setProjects((prev) => prev.filter((p) => p.id !== project.id));
                              setDeletingId(null);
                            } else {
                              setDeleteError(msg);
                            }
                          }
                        }}
                      >
                        Xoá
                      </button>
                      <button onClick={() => setDeletingId(null)}>Huỷ</button>
                    </div>
                    {deleteError && <p style={{ color: "red" }}>{deleteError}</p>}
                  </div>
                ) : (
                  <>
                    <h2>{project.name}</h2>
                    <p>{project.description}</p>
                  </>
                )}

                {isEditing && (
                  <EditProjectModal
                    project={project}
                    open={isEditing}
                    onClose={() => setEditingId(null)}
                    loading={editLoading}
                    error={editError}
                    onSave={async (data) => {
                      setEditLoading(true);
                      try {
                        setEditError(null);
                        const updated = await updateProject(project.id, data);
                        setProjects((prev) => prev.map((p) => (p.id === project.id ? updated : p)));
                        setEditingId(null);
                      } catch (err) {
                        setEditError(err instanceof Error ? err.message : "Update failed");
                      } finally {
                        setEditLoading(false);
                      }
                    }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

export default ProjectsPage;
