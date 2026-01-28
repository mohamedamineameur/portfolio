import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../sequelize.js";

export class Project extends Model<
  InferAttributes<Project>,
  InferCreationAttributes<Project>
> {
  declare id: CreationOptional<string>;
  declare titleFr: string;
  declare titleEn: string;
  declare descriptionFr: string;
  declare descriptionEn: string;
  declare url: string | null;
  declare githubUrl: string | null;
  declare imageUrls: string[];
  declare published: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Association methods (added by Sequelize)
  declare setTechnologies: (
    technologies: import("./Technology.model.js").Technology | import("./Technology.model.js").Technology[] | null
  ) => Promise<void>;
  declare getTechnologies: () => Promise<import("./Technology.model.js").Technology[]>;
  declare addTechnologies: (technologies: import("./Technology.model.js").Technology | import("./Technology.model.js").Technology[]) => Promise<void>;
  declare removeTechnologies: (technologies: import("./Technology.model.js").Technology | import("./Technology.model.js").Technology[]) => Promise<void>;
}

Project.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    titleFr: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    titleEn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descriptionFr: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    descriptionEn: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isValidUrl(value: string | null): void {
          if (value === null || value === "") {
            return; // null et chaîne vide sont autorisés
          }
          // Accepter les URLs http/https (avec ou sans chemin)
          if (
            !value.startsWith("http://") &&
            !value.startsWith("https://")
          ) {
            throw new Error("URL must start with http:// or https://");
          }
        },
      },
    },
    githubUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isValidUrl(value: string | null): void {
          if (value === null || value === "") {
            return; // null et chaîne vide sont autorisés
          }
          // Accepter les URLs http/https (avec ou sans chemin)
          if (
            !value.startsWith("http://") &&
            !value.startsWith("https://")
          ) {
            throw new Error("URL must start with http:// or https://");
          }
        },
      },
    },
    imageUrls: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Project",
    tableName: "projects",
  }
);
