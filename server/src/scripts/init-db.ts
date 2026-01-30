import { sequelize } from "../database/sequelize.js";
import { logger } from "../utils/logger.js";

/**
 * Script d'initialisation de la base de données
 * Se connecte et synchronise le schéma
 */
async function initDatabase(): Promise<void> {
  try {
    // Se connecter à la base de données
    await sequelize.authenticate();
    logger.info("Connexion à la base de données réussie");

    await sequelize.sync({ alter: false });
    logger.info("Schéma de base de données synchronisé");

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
