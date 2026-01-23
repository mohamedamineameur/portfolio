import { app } from "./app.js";
import { sequelize } from "./database/sequelize.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";
// Import models to ensure they are registered and associations are initialized
import "./database/models/index.js";

async function startServer(): Promise<void> {
  try {
    // Sync database
    await sequelize.sync({ alter: env.NODE_ENV === "development" });
    logger.info("Database synced");

    // Start server
    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer().catch((error) => {
  logger.error("Unhandled error in startServer:", error);
  process.exit(1);
});
