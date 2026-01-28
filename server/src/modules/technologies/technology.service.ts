import { Technology } from "../../database/models/Technology.model.js";
import { HttpError } from "../../utils/httpError.js";

export const technologyService = {
  async findAll(): Promise<Technology[]> {
    return Technology.findAll({
      order: [["name", "ASC"]],
    });
  },

  async findById(id: string): Promise<Technology | null> {
    return Technology.findByPk(id);
  },

  async create(data: {
    name: string;
    icon?: string | null;
    category?: string | null;
  }): Promise<Technology> {
    return Technology.create(data);
  },

  async update(
    id: string,
    data: {
      name?: string;
      icon?: string | null;
      category?: string | null;
    }
  ): Promise<Technology> {
    const technology = await Technology.findByPk(id);
    if (!technology) {
      throw new HttpError("Technology not found", 404);
    }
    await technology.update(data);
    return technology;
  },

  async delete(id: string): Promise<void> {
    const technology = await Technology.findByPk(id);
    if (!technology) {
      throw new HttpError("Technology not found", 404);
    }
    await technology.destroy();
  },
};
