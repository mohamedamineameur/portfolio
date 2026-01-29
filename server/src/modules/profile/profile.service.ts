import { Profile } from "../../database/models/Profile.model.js";
import { Photo } from "../../database/models/Photo.model.js";

type ProfileWithPhoto = Profile & { photo?: Photo };

export const profileService = {
  /**
   * Get the profile (singleton - only one profile exists)
   * Les URLs des photos sont renvoyées en relatif (/uploads/...) pour que le frontend ajoute la base.
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
    return profile as ProfileWithPhoto | null;
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
    descriptionFr?: string | null;
    descriptionEn?: string | null;
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
      return reloadedProfile as ProfileWithPhoto;
    } else {
      // Create new profile (only if none exists)
      profile = await Profile.create({
        nom: data.nom || "",
        prenom: data.prenom || "",
        email: data.email || "",
        tel: data.tel ?? null,
        linkedIn: data.linkedIn ?? null,
        github: data.github ?? null,
        descriptionFr: data.descriptionFr ?? null,
        descriptionEn: data.descriptionEn ?? null,
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
      return reloadedProfile as ProfileWithPhoto;
    }
  },
};
