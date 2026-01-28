import { env } from "../config/env.js";

/**
 * Construit l'URL complète d'une image à partir du chemin relatif renvoyé par l'API
 * (ex. /uploads/xxx.jpeg). Le frontend ajoute la base API.
 * Si l'URL est déjà absolue (http/https), elle est retournée telle quelle.
 */
export function getImageUrl(relativePath: string | null | undefined): string {
  if (!relativePath) return "";
  if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
    return relativePath;
  }
  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  const base = (env.API_URL ?? "").replace(/\/$/, "");
  return base ? `${base}${path}` : path;
}
