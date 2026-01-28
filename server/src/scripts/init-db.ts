import { sequelize } from "../database/sequelize.js";
import { logger } from "../utils/logger.js";
import { existsSync } from "fs";
import { env } from "../config/env.js";
import path from "path";

/**
 * Script d'initialisation de la base de données
 * Vérifie si la DB existe, sinon exécute les migrations
 */
async function initDatabase(): Promise<void> {
  try {
    // Vérifier si la base de données existe
    const dbPath = path.resolve(env.DB_STORAGE || "./database.sqlite");
    const dbExists = existsSync(dbPath);

    logger.info(`Base de données: ${dbPath}`);
    logger.info(`Existe: ${dbExists ? "Oui" : "Non"}`);

    // Se connecter à la base de données
    await sequelize.authenticate();
    logger.info("Connexion à la base de données réussie");

    // Si la DB n'existe pas, synchroniser le schéma
    if (!dbExists) {
      logger.info("Base de données introuvable, synchronisation du schéma...");
      await sequelize.sync({ alter: false });
      logger.info("Schéma de base de données synchronisé");
    } else {
      // Si la DB existe, juste vérifier la connexion
      logger.info("Base de données existante détectée, connexion établie");
      await sequelize.sync({ alter: false });
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    logger.error("Erreur lors de l'initialisation de la base de données:", error);
    await sequelize.close();
    process.exit(1);
  }
}

// Import models to ensure they are registered
import "../database/models/index.js";

initDatabase().catch((error) => {
  logger.error("Erreur non gérée:", error);
  process.exit(1);
});
