import { Project } from "../../database/models/Project.model.js";
import { Technology } from "../../database/models/Technology.model.js";
import type { WhereOptions } from "sequelize";

/**
 * Les URLs d'images des projets sont renvoyées en relatif (/uploads/...).
 * Le frontend ajoute la base URL pour charger les images.
 */
export const projectService = {
  async findAll(published?: boolean): Promise<Project[]> {
    const where: WhereOptions<Project> = {};
    if (published !== undefined) {
      where.published = published;
    }
    return Project.findAll({
      where,
      include: [Technology],
      order: [["createdAt", "DESC"]],
    });
  },

  async findById(id: string): Promise<Project | null> {
    return Project.findByPk(id, {
      include: [Technology],
    });
  },

  async create(data: {
    titleFr: string;
    titleEn: string;
    descriptionFr: string;
    descriptionEn: string;
    url?: string | null;
    githubUrl?: string | null;
    imageUrls?: string[];
    published: boolean;
    technologyIds?: string[];
  }): Promise<Project> {
    const { technologyIds, ...projectData } = data;
    const project = await Project.create({
      ...projectData,
      imageUrls: projectData.imageUrls ?? [],
    });

    if (technologyIds && technologyIds.length > 0) {
      const technologies = await Technology.findAll({
        where: { id: technologyIds },
      });
      await project.setTechnologies(technologies);
    }

    return project.reload({ include: [Technology] });
  },

  async update(
    id: string,
    data: {
      titleFr?: string;
      titleEn?: string;
      descriptionFr?: string;
      descriptionEn?: string;
      url?: string | null;
      githubUrl?: string | null;
      imageUrls?: string[];
      published?: boolean;
      technologyIds?: string[];
    }
  ): Promise<Project> {
    const project = await Project.findByPk(id);
    if (!project) {
      throw new Error("Project not found");
    }

    const { technologyIds, ...projectData } = data;
    await project.update(projectData);

    if (technologyIds !== undefined) {
      const technologies = await Technology.findAll({
        where: { id: technologyIds },
      });
      await project.setTechnologies(technologies);
    }

    return project.reload({ include: [Technology] });
  },

  async delete(id: string): Promise<void> {
    const project = await Project.findByPk(id);
    if (!project) {
      throw new Error("Project not found");
    }
    await project.destroy();
  },
};
