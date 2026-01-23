import { sequelize } from "./sequelize.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

/**
 * Database migration script.
 * Syncs the database schema with the models.
 */
async function migrate(): Promise<void> {
  try {
    logger.info("Starting database migration...");

    // Import all models to ensure they are registered
    await import("./models/index.js");

    // Sync database based on environment
    if (env.NODE_ENV === "production") {
      // In production, use sync without alter to avoid data loss
      await sequelize.sync({ alter: false });
      logger.info("Database synced (production mode - no alter)");
    } else {
      // In development, use alter to update schema
      await sequelize.sync({ alter: true });
      logger.info("Database synced (development mode - with alter)");
    }

    logger.info("Migration completed successfully");
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    logger.error("Migration failed:", error);
    await sequelize.close();
    process.exit(1);
  }
}

migrate().catch((error) => {
  logger.error("Unhandled migration error:", error);
  process.exit(1);
});
