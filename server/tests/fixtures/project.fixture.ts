import { Project } from "../../src/database/models/Project.model.js";
import { Technology } from "../../src/database/models/Technology.model.js";

export async function createProject(data?: {
  titleFr?: string;
  titleEn?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  url?: string | null;
  githubUrl?: string | null;
  imageUrl?: string | null;
  published?: boolean;
  technologyIds?: number[];
}): Promise<Project> {
  const titleFr = data?.titleFr || "Projet de test";
  const titleEn = data?.titleEn || "Test Project";
  const descriptionFr = data?.descriptionFr || "Ceci est une description de projet de test";
  const descriptionEn = data?.descriptionEn || "This is a test project description";
  const url = data?.url !== undefined ? data.url : "https://example.com";
  const githubUrl = data?.githubUrl !== undefined ? data.githubUrl : "https://github.com/example";
  const imageUrl = data?.imageUrl !== undefined ? data.imageUrl : "https://example.com/image.jpg";
  const published = data?.published !== undefined ? data.published : true;

  const project = await Project.create({
    titleFr,
    titleEn,
    descriptionFr,
    descriptionEn,
    url,
    githubUrl,
    imageUrl,
    published,
  });

  // Associate technologies if provided
  if (data?.technologyIds && data.technologyIds.length > 0) {
    const technologies = await Technology.findAll({
      where: { id: data.technologyIds },
    });
    if (technologies.length > 0) {
      await project.setTechnologies(technologies);
    }
  }

  return project.reload({ include: [Technology] });
}
