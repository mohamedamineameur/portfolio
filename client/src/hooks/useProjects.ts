import { useState, useEffect } from "react";
import { projectService } from "../services/project.service.js";
import type { Project } from "../types/api.js";

export function useProjects(published?: boolean) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await projectService.findAll(published);
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des projets");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [published]);

  return { projects, isLoading, error, refetch: () => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await projectService.findAll(published);
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des projets");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  } };
}
