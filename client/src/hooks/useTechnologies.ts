import { useState, useEffect } from "react";
import { technologyService } from "../services/technology.service.js";
import type { Technology } from "../types/api.js";

export function useTechnologies() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await technologyService.findAll();
        setTechnologies(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des technologies"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  return { technologies, isLoading, error };
}
