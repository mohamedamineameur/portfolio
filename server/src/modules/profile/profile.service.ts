import { Profile } from "../../database/models/Profile.model.js";
import { Photo } from "../../database/models/Photo.model.js";
import { HttpError } from "../../utils/httpError.js";
import { getAbsoluteImageUrl } from "../../utils/imageUrl.js";

/**
 * Transforme l'URL de la photo du profil en URL absolue
 * Modifie l'instance en place et retourne l'instance modifiée
 */
function transformProfilePhotoUrl(profile: Profile): Profile {
  if (profile.photo && profile.photo.url) {
    const absoluteUrl = getAbsoluteImageUrl(profile.photo.url);
    // Modifier directement la propriété de l'instance photo
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (profile.photo as any).url = absoluteUrl;
  }
  return profile;
}

export const profileService = {
  /**
   * Get the profile (singleton - only one profile exists)
   */
  async findOne(): Promise<Profile | null> {
    const profile = await Profile.findOne({
      include: [
        {
          model: Photo,
          as: "photo",
        },
      ],
    });
    if (!profile) {
      return null;
    }
    // Transformer l'URL de la photo en URL absolue
    return transformProfilePhotoUrl(profile);
  },

  /**
   * Create or update the profile (singleton pattern)
   * If profile exists, update it; otherwise create it
   */
  async createOrUpdate(data: {
    nom?: string;
    prenom?: string;
    email?: string;
    tel?: string | null;
    linkedIn?: string | null;
    github?: string | null;
    photoId?: string | null;
  }): Promise<Profile> {
    // Check if profile already exists
    let profile = await Profile.findOne();

    if (profile) {
      // Update existing profile
      await profile.update(data);
      const reloadedProfile = await profile.reload({
        include: [
          {
            model: Photo,
            as: "photo",
          },
        ],
      });
      return transformProfilePhotoUrl(reloadedProfile);
    } else {
      // Create new profile (only if none exists)
      profile = await Profile.create({
        nom: data.nom || "",
        prenom: data.prenom || "",
        email: data.email || "",
        tel: data.tel ?? null,
        linkedIn: data.linkedIn ?? null,
        github: data.github ?? null,
        photoId: data.photoId ?? null,
      });
      const reloadedProfile = await profile.reload({
        include: [
          {
            model: Photo,
            as: "photo",
          },
        ],
      });
      return transformProfilePhotoUrl(reloadedProfile);
    }
  },
};
