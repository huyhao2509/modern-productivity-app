import { useEffect, useState } from "react";
import { createProject, fetchProjects } from "../services/projectApi";
import type { Project } from "../types/project";
import "./ProjectsPage.css";

const PROJECT_TONES = ["mint", "sun", "ocean"] as const;

function getProjectTone(id: number): (typeof PROJECT_TONES)[number] {
  const toneIndex = (id - 1) % PROJECT_TONES.length;
  return PROJECT_TONES[toneIndex] ?? PROJECT_TONES[0];
}

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      try {
        const projectList = await fetchProjects();
        setProjects(projectList);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    void loadProjects();
  }, []);

  async function handleCreateProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !description.trim()) {
      setError("Name and description are required");
      return;
    }

    try {
      setCreating(true);
      setError(null);

      const newProject = await createProject({
        name: name.trim(),
        description: description.trim(),
      });

      setProjects((current) => [...current, newProject]);
      setName("");
      setDescription("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setCreating(false);
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

      {loading && <p className="projects-page__status">Loading projects...</p>}

      {error && (
        <p className="projects-page__status projects-page__status--error">
          Could not load projects: {error}
        </p>
      )}

      {!loading && !error && (
        <ul className="projects-grid" aria-label="Project list">
          {projects.map((project) => {
            const tone = getProjectTone(project.id);

            return (
              <li key={project.id} className={`project-card project-card--${tone}`}>
                <div className="project-card__head">
                  <span className="project-card__badge">Project #{project.id}</span>
                </div>

                <h2>{project.name}</h2>
                <p>{project.description}</p>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

export default ProjectsPage;
