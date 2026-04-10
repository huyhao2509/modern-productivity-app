import { useEffect, useState } from "react";
import { fetchProjects } from "../services/projectApi";
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

  return (
    <main className="projects-page">
      <header className="projects-page__hero">
        <p className="projects-page__eyebrow">Workspace Overview</p>
        <h1>Projects</h1>
        <p className="projects-page__subtitle">
          A quick view of active initiatives synced from your backend API.
        </p>
      </header>

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
