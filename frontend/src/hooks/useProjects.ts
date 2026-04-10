import { useEffect, useState } from "react";
import { createProject, deleteProject, fetchProjects } from "../services/projectApi";
import type { Project } from "../types/project";

interface UseProjectsResult {
  projects: Project[];
  loading: boolean;
  error: string | null;
  name: string;
  description: string;
  creating: boolean;
  deletingId: number | null;
  setName: (value: string) => void;
  setDescription: (value: string) => void;
  createCurrentProject: () => Promise<void>;
  removeProjectById: (projectId: number) => Promise<void>;
}

export function useProjects(): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    // Initial data load for Projects page.
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

  async function createCurrentProject() {
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

  async function removeProjectById(projectId: number) {
    try {
      setDeletingId(projectId);
      setError(null);
      await deleteProject(projectId);
      setProjects((current) => current.filter((project) => project.id !== projectId));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setDeletingId(null);
    }
  }

  return {
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
  };
}
