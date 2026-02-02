import { useEffect } from "react";
import { useProfile } from "../../hooks/useProfile";
import { getImageUrl } from "../../utils/imageUrl";

/**
 * Met à jour og:image et twitter:image avec la photo de profil une fois chargée.
 * Utilisé pour la miniature Google et les partages (réseaux sociaux, messageries).
 */
export function ProfileMetaImage() {
  const { profile } = useProfile();

  useEffect(() => {
    const photoUrl = profile?.photo?.url;
    if (!photoUrl) return;

    const fullUrl = getImageUrl(photoUrl);
    const absoluteUrl =
      fullUrl.startsWith("http://") || fullUrl.startsWith("https://")
        ? fullUrl
        : `${typeof window !== "undefined" ? window.location.origin : ""}${fullUrl.startsWith("/") ? fullUrl : `/${fullUrl}`}`;

    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el && el.getAttribute("content") !== content) {
        el.setAttribute("content", content);
      }
    };

    setMeta('meta[property="og:image"]', absoluteUrl);
    setMeta('meta[name="twitter:image"]', absoluteUrl);
  }, [profile?.photo?.url]);

  return null;
}
