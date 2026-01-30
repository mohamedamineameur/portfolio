import readline from "readline";
import { readFileSync } from "fs";
import { sequelize } from "../database/sequelize.js";
import { Project } from "../database/models/Project.model.js";
import { Technology } from "../database/models/Technology.model.js";
import "../database/models/index.js";

interface TechnologyInput {
  id?: string;
  name: string;
  icon?: string | null;
  category?: string | null;
}

interface ProjectInput {
  id?: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  url?: string | null;
  githubUrl?: string | null;
  imageUrls?: string[];
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
  Technologies?: TechnologyInput[];
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main(): Promise<void> {
  console.log("=== Création de projets ===\n");

  let jsonInput = "";
  const filePath = process.argv[2];

  if (filePath) {
    // Read from file
    try {
      jsonInput = readFileSync(filePath, "utf-8");
      console.log(`Lecture du fichier: ${filePath}\n`);
    } catch (error) {
      console.error(`Erreur de lecture du fichier: ${filePath}`, error);
      process.exit(1);
    }
  } else {
    // Read from stdin
    console.log("Collez le JSON des projets (tableau) puis appuyez sur Entrée deux fois:\n");
    let emptyLineCount = 0;

    for await (const line of rl) {
      if (line.trim() === "") {
        emptyLineCount++;
        if (emptyLineCount >= 1 && jsonInput.trim()) {
          break;
        }
      } else {
        emptyLineCount = 0;
        jsonInput += line + "\n";
      }
    }
  }

  if (!jsonInput.trim()) {
    console.error("Aucun JSON fourni.");
    process.exit(1);
  }

  let data: ProjectInput[];
  try {
    const parsed = JSON.parse(jsonInput) as ProjectInput | ProjectInput[];
    // Support both single object and array
    data = Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    console.error("JSON invalide:", error);
    process.exit(1);
  }

  console.log(`\n${data.length} projet(s) à créer:`);
  data.forEach((p, i) => {
    const techNames = p.Technologies?.map((t) => t.name).join(", ") || "aucune";
    console.log(`  ${i + 1}. ${p.titleFr} / ${p.titleEn}`);
    console.log(`     Technologies: ${techNames}`);
  });

  const confirm = await question("\nConfirmer la création? (o/n): ");
  if (confirm.toLowerCase() !== "o" && confirm.toLowerCase() !== "oui") {
    console.log("Annulé.");
    rl.close();
    process.exit(0);
  }

  try {
    await sequelize.authenticate();
    console.log("Connexion à la base de données établie.\n");

    let created = 0;
    let skipped = 0;

    for (const projectData of data) {
      // Check if project with same title already exists
      const existing = await Project.findOne({ where: { titleFr: projectData.titleFr } });
      if (existing) {
        console.log(`⏭ "${projectData.titleFr}" existe déjà, ignoré.`);
        skipped++;
        continue;
      }

      // Create project (ignore id, createdAt, updatedAt)
      const project = await Project.create({
        titleFr: projectData.titleFr,
        titleEn: projectData.titleEn,
        descriptionFr: projectData.descriptionFr,
        descriptionEn: projectData.descriptionEn,
        url: projectData.url || null,
        githubUrl: projectData.githubUrl || null,
        imageUrls: projectData.imageUrls || [],
        published: projectData.published ?? true,
      });

      // Associate technologies by name
      if (projectData.Technologies && projectData.Technologies.length > 0) {
        const techNames = projectData.Technologies.map((t) => t.name);
        const foundTechnologies: Technology[] = [];
        const notFoundTechNames: string[] = [];

        for (const techName of techNames) {
          const tech = await Technology.findOne({ where: { name: techName } });
          if (tech) {
            foundTechnologies.push(tech);
          } else {
            notFoundTechNames.push(techName);
          }
        }

        if (foundTechnologies.length > 0) {
          const techIds = foundTechnologies.map((t) => t.id);
          await (project as typeof project & { setTechnologies: (ids: string[]) => Promise<void> }).setTechnologies(techIds);
        }

        if (notFoundTechNames.length > 0) {
          console.log(`  ⚠ Technologies non trouvées: ${notFoundTechNames.join(", ")}`);
        }

        console.log(`✓ "${projectData.titleFr}" créé avec ${foundTechnologies.length} technologie(s).`);
      } else {
        console.log(`✓ "${projectData.titleFr}" créé (sans technologies).`);
      }

      created++;
    }

    console.log(`\nTerminé: ${created} créé(s), ${skipped} ignoré(s).`);
  } catch (error) {
    console.error("Erreur lors de la création:", error);
    process.exit(1);
  } finally {
    rl.close();
    await sequelize.close();
  }
}

main().catch(console.error);
