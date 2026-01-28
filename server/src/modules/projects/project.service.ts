import { Project } from "../../database/models/Project.model.js";
import { Technology } from "../../database/models/Technology.model.js";
import type { WhereOptions } from "sequelize";
import { getAbsoluteImageUrls } from "../../utils/imageUrl.js";

/**
 * Transforme les URLs d'images d'un projet en URLs absolues
 * Modifie l'instance en place et retourne l'instance modifiée
 */
function transformProjectImageUrls(project: Project): Project {
  const urls = getAbsoluteImageUrls(project.imageUrls as (string | null)[] | null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (project as any).imageUrls = urls;
  return project;
}

export const projectService = {
  async findAll(published?: boolean): Promise<Project[]> {
    const where: WhereOptions<Project> = {};
    if (published !== undefined) {
      where.published = published;
    }
    const projects = await Project.findAll({
      where,
      include: [Technology],
      order: [["createdAt", "DESC"]],
    });
    // Transformer les URLs d'images en URLs absolues
    return projects.map(transformProjectImageUrls);
  },

  async findById(id: string): Promise<Project | null> {
    const project = await Project.findByPk(id, {
      include: [Technology],
    });
    if (!project) {
      return null;
    }
    // Transformer les URLs d'images en URLs absolues
    return transformProjectImageUrls(project);
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

    const reloadedProject = await project.reload({ include: [Technology] });
    return transformProjectImageUrls(reloadedProject);
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

    const reloadedProject = await project.reload({ include: [Technology] });
    return transformProjectImageUrls(reloadedProject);
  },

  async delete(id: string): Promise<void> {
    const project = await Project.findByPk(id);
    if (!project) {
      throw new Error("Project not found");
    }
    await project.destroy();
  },
};
