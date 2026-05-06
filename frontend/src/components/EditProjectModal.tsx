import { useState } from "react";
import type { Project } from "../types/project";

interface EditProjectModalProps {
  project: Project;
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string }) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export default function EditProjectModal({ project, open, onClose, onSave, loading, error }: EditProjectModalProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Project</h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onSave({ name, description });
          }}
        >
          <label style={{ display: "block", marginBottom: 8 }}>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: "100%", marginTop: 4 }}
            />
          </label>
          <label style={{ display: "block", marginBottom: 8 }}>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={2}
              style={{ width: "100%", marginTop: 4 }}
            />
          </label>
          {error && <p style={{ color: "red", marginBottom: 8 }}>{error}</p>}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
