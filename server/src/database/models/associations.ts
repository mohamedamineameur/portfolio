import { Project } from "./Project.model.js";
import { Technology } from "./Technology.model.js";

/**
 * Initialize all model associations.
 * This file must be imported after all models are initialized
 * to avoid circular dependency issues.
 */
export function initializeAssociations(): void {
  // Many-to-Many relationship between Projects and Technologies
  Project.belongsToMany(Technology, {
    through: "ProjectTechnologies",
    foreignKey: "projectId",
    otherKey: "technologyId",
  });

  Technology.belongsToMany(Project, {
    through: "ProjectTechnologies",
    foreignKey: "technologyId",
    otherKey: "projectId",
  });
}
