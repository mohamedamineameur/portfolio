import { env } from "../config/env.js";

/**
 * Transforme une URL d'image relative en URL absolue
 * Si l'URL commence par /uploads/, elle est transformée en URL complète du serveur
 * @param imageUrl - URL relative ou absolue de l'image
 * @returns URL absolue de l'image ou null si imageUrl est null
 */
export function getAbsoluteImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl) {
    return null;
  }

  // Si l'URL est déjà absolue (commence par http:// ou https://), on la retourne telle quelle
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // Construire l'URL du serveur
  const serverUrl = env.SERVER_URL;

  // Si l'URL commence par /, on l'ajoute directement au serveur
  if (imageUrl.startsWith("/")) {
    return `${serverUrl}${imageUrl}`;
  }

  // Sinon, on ajoute /uploads/ devant
  return `${serverUrl}/uploads/${imageUrl}`;
}
