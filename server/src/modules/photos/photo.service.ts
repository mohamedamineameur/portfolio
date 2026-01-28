import { Photo } from "../../database/models/Photo.model.js";

/**
 * Les URLs des photos sont stockées et renvoyées en relatif (/uploads/...).
 * Le frontend ajoute la base URL (API) pour charger les images.
 */
export const photoService = {
  findAll: async (): Promise<Photo[]> => {
    return Photo.findAll({
      order: [["createdAt", "DESC"]],
    });
  },

  findById: async (id: string): Promise<Photo | null> => {
    return Photo.findByPk(id);
  },

  create: async (url: string): Promise<Photo> => {
    return Photo.create({ url });
  },

  delete: async (id: string): Promise<void> => {
    const photo = await Photo.findByPk(id);
    if (!photo) {
      throw new Error("Photo not found");
    }
    await photo.destroy();
  },
};
