interface ProjectFormProps {
  name: string;
  description: string;
  creating: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
}

function ProjectForm({
  name,
  description,
  creating,
  onNameChange,
  onDescriptionChange,
  onSubmit,
}: ProjectFormProps) {
  return (
    <section className="project-form-section" aria-label="Create project">
      <h2>Create Project</h2>
      <form
        className="project-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <label className="project-form__field">
          <span>Name</span>
          <input
            type="text"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Ex: Mobile Planner"
            disabled={creating}
          />
        </label>

        <label className="project-form__field">
          <span>Description</span>
          <textarea
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
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
  );
}

export default ProjectForm;
