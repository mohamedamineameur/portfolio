import readline from "readline";
import { sequelize } from "../database/sequelize.js";
import { Profile } from "../database/models/Profile.model.js";
import "../database/models/index.js";

interface ProfileInput {
  id?: string;
  nom?: string;
  prenom?: string;
  email?: string;
  tel?: string | null;
  linkedIn?: string | null;
  github?: string | null;
  descriptionFr?: string | null;
  descriptionEn?: string | null;
  // These fields are ignored
  photoId?: string;
  createdAt?: string;
  updatedAt?: string;
  photo?: unknown;
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
  console.log("=== Création de profil ===\n");
  console.log("Collez le JSON du profil (puis appuyez sur Entrée deux fois):\n");

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

  let data: ProfileInput;
  try {
    data = JSON.parse(jsonInput) as ProfileInput;
  } catch (error) {
    console.error("JSON invalide:", error);
    process.exit(1);
  }

  // Extract only the fields we want (ignore photoId, createdAt, updatedAt, photo)
  const profileData = {
    nom: data.nom || "",
    prenom: data.prenom || "",
    email: data.email || "",
    tel: data.tel || null,
    linkedIn: data.linkedIn || null,
    github: data.github || null,
    descriptionFr: data.descriptionFr || null,
    descriptionEn: data.descriptionEn || null,
  };

  console.log("\nDonnées du profil à créer:");
  console.log(JSON.stringify(profileData, null, 2));

  const confirm = await question("\nConfirmer la création? (o/n): ");
  if (confirm.toLowerCase() !== "o" && confirm.toLowerCase() !== "oui") {
    console.log("Annulé.");
    rl.close();
    process.exit(0);
  }

  try {
    await sequelize.authenticate();
    console.log("Connexion à la base de données établie.");

    // Check if a profile already exists
    const existingProfile = await Profile.findOne();
    if (existingProfile) {
      console.log("Un profil existe déjà. Mise à jour...");
      await existingProfile.update(profileData);
      console.log(`\nProfil mis à jour avec succès (ID: ${existingProfile.id})`);
    } else {
      const profile = await Profile.create(profileData);
      console.log(`\nProfil créé avec succès (ID: ${profile.id})`);
    }
  } catch (error) {
    console.error("Erreur lors de la création du profil:", error);
    process.exit(1);
  } finally {
    rl.close();
    await sequelize.close();
  }
}

main().catch(console.error);
