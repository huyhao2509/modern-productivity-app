import type { Project } from "../../types/project";

interface ProjectCardProps {
  project: Project;
  tone: "mint" | "sun" | "ocean";
  isDeleting: boolean;
  onDelete: (projectId: number) => void;
}

function ProjectCard({ project, tone, isDeleting, onDelete }: ProjectCardProps) {
  return (
    <li className={`project-card project-card--${tone}`}>
      <div className="project-card__head">
        <span className="project-card__badge">Project #{project.id}</span>
        <button
          type="button"
          className="project-card__delete"
          disabled={isDeleting}
          onClick={() => onDelete(project.id)}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      <h2>{project.name}</h2>
      <p>{project.description}</p>
    </li>
  );
}

export default ProjectCard;
