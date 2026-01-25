import { Project } from "../../database/models/Project.model.js";
import { Technology } from "../../database/models/Technology.model.js";
import type { WhereOptions } from "sequelize";
import { getAbsoluteImageUrl } from "../../utils/imageUrl.js";

/**
 * Transforme les URLs d'images d'un projet en URLs absolues
 * Modifie l'instance en place et retourne l'instance modifiée
 */
function transformProjectImageUrl(project: Project): Project {
  const absoluteUrl = getAbsoluteImageUrl(project.imageUrl);
  // Modifier directement la propriété de l'instance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (project as any).imageUrl = absoluteUrl;
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
    return projects.map(transformProjectImageUrl);
  },

  async findById(id: string): Promise<Project | null> {
    const project = await Project.findByPk(id, {
      include: [Technology],
    });
    if (!project) {
      return null;
    }
    // Transformer l'URL d'image en URL absolue
    return transformProjectImageUrl(project);
  },

  async create(data: {
    titleFr: string;
    titleEn: string;
    descriptionFr: string;
    descriptionEn: string;
    url?: string | null;
    githubUrl?: string | null;
    imageUrl?: string | null;
    published: boolean;
    technologyIds?: string[];
  }): Promise<Project> {
    const { technologyIds, ...projectData } = data;
    const project = await Project.create(projectData);

    if (technologyIds && technologyIds.length > 0) {
      const technologies = await Technology.findAll({
        where: { id: technologyIds },
      });
      await project.setTechnologies(technologies);
    }

    const reloadedProject = await project.reload({ include: [Technology] });
    return transformProjectImageUrl(reloadedProject);
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
      imageUrl?: string | null;
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
    return transformProjectImageUrl(reloadedProject);
  },

  async delete(id: number): Promise<void> {
    const project = await Project.findByPk(id);
    if (!project) {
      throw new Error("Project not found");
    }
    await project.destroy();
  },
};
