import { Project } from "./Project.model.js";
import { Technology } from "./Technology.model.js";
import { Profile } from "./Profile.model.js";
import { Photo } from "./Photo.model.js";

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

  // One-to-One relationship between Profile and Photo
  Profile.belongsTo(Photo, {
    foreignKey: "photoId",
    as: "photo",
  });

  Photo.hasOne(Profile, {
    foreignKey: "photoId",
    as: "profile",
  });
}
