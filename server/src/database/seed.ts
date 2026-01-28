import { sequelize } from "./sequelize.js";
import { logger } from "../utils/logger.js";
import { hashPassword } from "../utils/hash.js";

// Import all models to ensure they are registered and associations are initialized
import "./models/index.js";

import { User } from "./models/User.model.js";
import { Project } from "./models/Project.model.js";
import { Technology } from "./models/Technology.model.js";
import { Profile } from "./models/Profile.model.js";
import { Photo } from "./models/Photo.model.js";

async function seed(): Promise<void> {
  try {
    logger.info("Starting database seeding...");

    // Import all models to ensure they are registered
    await import("./models/index.js");

    // Ensure database is synced
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });

    // Create admin user
    const adminEmail = "admin@portfolio.com";
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const admin = await User.create({
        email: adminEmail,
        password: await hashPassword.hash("admin123"),
        role: "admin",
      });
      logger.info(`Admin user created: ${admin.email}`);
    } else {
      logger.info("Admin user already exists");
    }

    // Create technologies
    const technologiesData = [
      { name: "React", icon: "react-icon", category: "Frontend" },
      { name: "TypeScript", icon: "typescript-icon", category: "Language" },
      { name: "Node.js", icon: "nodejs-icon", category: "Backend" },
      { name: "Express", icon: "express-icon", category: "Backend" },
      { name: "PostgreSQL", icon: "postgresql-icon", category: "Database" },
      { name: "MongoDB", icon: "mongodb-icon", category: "Database" },
      { name: "Tailwind CSS", icon: "tailwind-icon", category: "Frontend" },
      { name: "Docker", icon: "docker-icon", category: "DevOps" },
      { name: "Vue.js", icon: "vue-icon", category: "Frontend" },
      { name: "Python", icon: "python-icon", category: "Language" },
    ];

    const technologies: Technology[] = [];
    for (const tech of technologiesData) {
      const [technology] = await Technology.findOrCreate({
        where: { name: tech.name },
        defaults: tech,
      });
      technologies.push(technology);
    }

    logger.info(`Created/found ${technologies.length} technologies`);

    // Create profile photo
    const photoUrl = "/uploads/amine.jpeg"; // Profile photo
    const [photo] = await Photo.findOrCreate({
      where: { url: photoUrl },
      defaults: {
        url: photoUrl,
      },
    });
    logger.info(`Created/found profile photo: ${photo.url}`);

    // Create profile (singleton - only one profile)
    const existingProfile = await Profile.findOne();
    if (!existingProfile) {
      const profile = await Profile.create({
        nom: "Dupont",
        prenom: "Jean",
        email: "jean.dupont@example.com",
        tel: "+33 6 12 34 56 78",
        linkedIn: "https://linkedin.com/in/jeandupont",
        github: "https://github.com/jeandupont",
        photoId: photo.id,
      });
      logger.info(`Created profile: ${profile.prenom} ${profile.nom}`);
    } else {
      // Update existing profile with photo if not set
      if (!existingProfile.photoId) {
        await existingProfile.update({ photoId: photo.id });
        logger.info(`Updated existing profile with photo`);
      } else {
        logger.info(`Profile already exists: ${existingProfile.prenom} ${existingProfile.nom}`);
      }
    }

    // Create a map of technology names to Technology instances
    const technologyMap = new Map<string, Technology>();
    for (const tech of technologies) {
      technologyMap.set(tech.name, tech);
    }

    // Create projects
    const projectsData = [
      {
        titleFr: "Application E-commerce",
        titleEn: "E-commerce Application",
        descriptionFr:
          "Une application e-commerce complète avec gestion de panier, paiement et administration. Développée avec React et Node.js, elle offre une expérience utilisateur fluide et sécurisée.",
        descriptionEn:
          "A complete e-commerce application with cart management, payment and administration. Developed with React and Node.js, it offers a smooth and secure user experience.",
        url: "https://example.com/ecommerce",
        githubUrl: "https://github.com/example/ecommerce",
        imageUrls: ["/uploads/ecommerce.svg"],
        published: true,
        technologyNames: ["React", "TypeScript", "Node.js", "Express"],
      },
      {
        titleFr: "Dashboard Analytics",
        titleEn: "Analytics Dashboard",
        descriptionFr:
          "Tableau de bord analytique en temps réel avec visualisations de données interactives. Utilise des technologies modernes pour offrir des insights puissants.",
        descriptionEn:
          "Real-time analytics dashboard with interactive data visualizations. Uses modern technologies to provide powerful insights.",
        url: "https://example.com/dashboard",
        githubUrl: "https://github.com/example/dashboard",
        imageUrls: ["/uploads/dashboard.svg"],
        published: true,
        technologyNames: ["React", "TypeScript", "Tailwind CSS"],
      },
      {
        titleFr: "API RESTful",
        titleEn: "RESTful API",
        descriptionFr:
          "API RESTful robuste et scalable avec authentification JWT, validation des données et documentation complète. Architecture microservices avec Docker.",
        descriptionEn:
          "Robust and scalable RESTful API with JWT authentication, data validation and complete documentation. Microservices architecture with Docker.",
        url: null,
        githubUrl: "https://github.com/example/api",
        imageUrls: [],
        published: true,
        technologyNames: ["Node.js", "Express", "PostgreSQL", "Docker"],
      },
      {
        titleFr: "Application Mobile",
        titleEn: "Mobile Application",
        descriptionFr:
          "Application mobile cross-platform développée avec React Native. Interface intuitive et performances optimisées pour iOS et Android.",
        descriptionEn:
          "Cross-platform mobile application developed with React Native. Intuitive interface and optimized performance for iOS and Android.",
        url: "https://example.com/mobile",
        githubUrl: null,
        imageUrls: ["/uploads/mobile-app.svg"],
        published: true,
        technologyNames: ["React", "TypeScript"],
      },
      {
        titleFr: "Projet en développement",
        titleEn: "Project in Development",
        descriptionFr:
          "Un projet passionnant actuellement en développement. Plus d'informations à venir bientôt.",
        descriptionEn:
          "An exciting project currently in development. More information coming soon.",
        url: null,
        githubUrl: null,
        imageUrls: [],
        published: false,
        technologyNames: ["Vue.js", "Python"],
      },
    ];

    for (const projectData of projectsData) {
      const { technologyNames, ...projectFields } = projectData;
      const existingProject = await Project.findOne({
        where: { titleFr: projectFields.titleFr },
      });

      if (!existingProject) {
        const project = await Project.create(projectFields);
        if (technologyNames && technologyNames.length > 0) {
          const projectTechnologies = technologyNames
            .map((name) => technologyMap.get(name))
            .filter((tech): tech is Technology => tech !== undefined);
          if (projectTechnologies.length > 0) {
            // Clear existing associations first, then add new ones
            await project.setTechnologies([]);
            for (const tech of projectTechnologies) {
              await project.addTechnologies(tech);
            }
          }
        }
        logger.info(`Created project: ${project.titleFr}`);
      } else {
        logger.info(`Project already exists: ${projectFields.titleFr}`);
      }
    }

    logger.info("Database seeding completed successfully");
  } catch (error) {
    logger.error("Seeding failed:", error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

seed().catch((error) => {
  logger.error("Unhandled error in seed:", error);
  process.exit(1);
});
