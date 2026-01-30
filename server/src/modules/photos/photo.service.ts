import { Photo } from "../../database/models/Photo.model.js";
import { deleteFromGcs } from "../../services/gcs.service.js";

/**
 * Les URLs des photos sont stockées en URL complète GCS.
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
    // Delete from GCS
    await deleteFromGcs(photo.url);
    // Delete from database
    await photo.destroy();
  },
};
