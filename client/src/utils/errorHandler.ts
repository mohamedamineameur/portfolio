import { AxiosError } from "axios";

/**
 * Extrait le message d'erreur d'une réponse Axios
 * Priorité : error.response.data.error > error.response.data.message > error.message
 */
export function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // Erreur avec réponse du serveur
    if (error.response?.data) {
      const data = error.response.data;
      
      // Si c'est un objet avec une propriété "error"
      if (typeof data === "object" && "error" in data) {
        return String(data.error);
      }
      
      // Si c'est un objet avec une propriété "message"
      if (typeof data === "object" && "message" in data) {
        return String(data.message);
      }
      
      // Si c'est directement une chaîne
      if (typeof data === "string") {
        return data;
      }
      
      // Si c'est un tableau d'erreurs (validation Zod)
      if (Array.isArray(data) && data.length > 0) {
        const firstError = data[0];
        if (typeof firstError === "object" && "message" in firstError) {
          return String(firstError.message);
        }
      }
    }
    
    // Message d'erreur Axios par défaut
    if (error.message) {
      return error.message;
    }
  }
  
  // Erreur JavaScript standard
  if (error instanceof Error) {
    return error.message;
  }
  
  // Fallback
  return "Une erreur inattendue s'est produite";
}
