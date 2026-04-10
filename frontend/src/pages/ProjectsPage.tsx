import { useProjects } from "../hooks/useProjects";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectForm from "../components/projects/ProjectForm";
import "./ProjectsPage.css";

const PROJECT_TONES = ["mint", "sun", "ocean"] as const;

function getProjectTone(id: number): (typeof PROJECT_TONES)[number] {
  const toneIndex = (id - 1) % PROJECT_TONES.length;
  return PROJECT_TONES[toneIndex] ?? PROJECT_TONES[0];
}

function ProjectsPage() {
  const {
    projects,
    loading,
    error,
    name,
    description,
    creating,
    deletingId,
    setName,
    setDescription,
    createCurrentProject,
    removeProjectById,
  } = useProjects();

  return (
    <main className="projects-page">
      <header className="projects-page__hero">
        <p className="projects-page__eyebrow">Workspace Overview</p>
        <h1>Projects</h1>
        <p className="projects-page__subtitle">
          A quick view of active initiatives synced from your backend API.
        </p>
      </header>

      <ProjectForm
        name={name}
        description={description}
        creating={creating}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        onSubmit={createCurrentProject}
      />

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
              <ProjectCard
                key={project.id}
                project={project}
                tone={tone}
                isDeleting={deletingId === project.id}
                onDelete={(projectId) => {
                  void removeProjectById(projectId);
                }}
              />
            );
          })}
        </ul>
      )}
    </main>
  );
}

export default ProjectsPage;
