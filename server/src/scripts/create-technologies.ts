import readline from "readline";
import { sequelize } from "../database/sequelize.js";
import { Technology } from "../database/models/Technology.model.js";
import "../database/models/index.js";

interface TechnologyInput {
  id?: string;
  name: string;
  icon?: string | null;
  category?: string | null;
  createdAt?: string;
  updatedAt?: string;
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
  console.log("=== Création de technologies ===\n");
  console.log("Collez le JSON des technologies (tableau) puis appuyez sur Entrée deux fois:\n");

  let jsonInput = "";
  let emptyLineCount = 0;

  // Read multiline JSON input
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

  if (!jsonInput.trim()) {
    console.error("Aucun JSON fourni.");
    process.exit(1);
  }

  let data: TechnologyInput[];
  try {
    const parsed = JSON.parse(jsonInput) as TechnologyInput | TechnologyInput[];
    // Support both single object and array
    data = Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    console.error("JSON invalide:", error);
    process.exit(1);
  }

  // Extract only the fields we want (ignore id, createdAt, updatedAt)
  const technologies = data.map((t) => ({
    name: t.name,
    icon: t.icon || null,
    category: t.category || null,
  }));

  console.log(`\n${technologies.length} technologie(s) à créer:`);
  technologies.forEach((t, i) => {
    console.log(`  ${i + 1}. ${t.name} (${t.category || "sans catégorie"})`);
  });

  const confirm = await question("\nConfirmer la création? (o/n): ");
  if (confirm.toLowerCase() !== "o" && confirm.toLowerCase() !== "oui") {
    console.log("Annulé.");
    rl.close();
    process.exit(0);
  }

  try {
    await sequelize.authenticate();
    console.log("Connexion à la base de données établie.");

    let created = 0;
    let skipped = 0;

    for (const tech of technologies) {
      // Check if technology with same name already exists
      const existing = await Technology.findOne({ where: { name: tech.name } });
      if (existing) {
        console.log(`  ⏭ "${tech.name}" existe déjà, ignoré.`);
        skipped++;
      } else {
        await Technology.create(tech);
        console.log(`  ✓ "${tech.name}" créé.`);
        created++;
      }
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
