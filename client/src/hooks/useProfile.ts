import { useState, useEffect } from "react";
import { profileService } from "../services/profile.service.js";
import type { Profile } from "../types/api.js";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await profileService.findOne();
        setProfile(data);
      } catch (err: unknown) {
        // Profile not found is not an error, it's just not created yet
        if (
          err &&
          typeof err === "object" &&
          "response" in err &&
          err.response &&
          typeof err.response === "object" &&
          "status" in err.response &&
          err.response.status === 404
        ) {
          setProfile(null);
        } else {
          setError(
            err instanceof Error
              ? err.message
              : "Erreur lors du chargement du profil"
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const refetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await profileService.findOne();
      setProfile(data);
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "status" in err.response &&
        err.response.status === 404
      ) {
        setProfile(null);
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement du profil"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { profile, isLoading, error, refetch };
}
