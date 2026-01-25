import { Photo } from "../../database/models/Photo.model.js";
import { getAbsoluteImageUrl } from "../../utils/imageUrl.js";

export const photoService = {
  findAll: async (): Promise<Photo[]> => {
    const photos = await Photo.findAll({
      order: [["createdAt", "DESC"]],
    });
    // Transformer les URLs en URLs absolues
    return photos.map((photo) => {
      const absoluteUrl = getAbsoluteImageUrl(photo.url);
      return {
        ...photo.toJSON(),
        url: absoluteUrl,
      } as Photo;
    });
  },

  findById: async (id: string): Promise<Photo | null> => {
    const photo = await Photo.findByPk(id);
    if (!photo) {
      return null;
    }
    const absoluteUrl = getAbsoluteImageUrl(photo.url);
    return {
      ...photo.toJSON(),
      url: absoluteUrl,
    } as Photo;
  },

  create: async (url: string): Promise<Photo> => {
    const photo = await Photo.create({ url });
    const absoluteUrl = getAbsoluteImageUrl(photo.url);
    return {
      ...photo.toJSON(),
      url: absoluteUrl,
    } as Photo;
  },

  delete: async (id: string): Promise<void> => {
    const photo = await Photo.findByPk(id);
    if (!photo) {
      throw new Error("Photo not found");
    }
    await photo.destroy();
  },
};
