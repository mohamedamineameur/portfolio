import { Project } from "../../database/models/Project.model.js";
import { Technology } from "../../database/models/Technology.model.js";
import type { WhereOptions } from "sequelize";

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

  async findById(id: number): Promise<Project | null> {
    return Project.findByPk(id, {
      include: [Technology],
    });
  },

  async create(data: {
    title: string;
    description: string;
    url?: string | null;
    githubUrl?: string | null;
    imageUrl?: string | null;
    published: boolean;
    technologyIds?: number[];
  }): Promise<Project> {
    const { technologyIds, ...projectData } = data;
    const project = await Project.create(projectData);

    if (technologyIds && technologyIds.length > 0) {
      const technologies = await Technology.findAll({
        where: { id: technologyIds },
      });
      await project.setTechnologies(technologies);
    }

    return project.reload({ include: [Technology] });
  },

  async update(
    id: number,
    data: {
      title?: string;
      description?: string;
      url?: string | null;
      githubUrl?: string | null;
      imageUrl?: string | null;
      published?: boolean;
      technologyIds?: number[];
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

  async delete(id: number): Promise<void> {
    const project = await Project.findByPk(id);
    if (!project) {
      throw new Error("Project not found");
    }
    await project.destroy();
  },
};
