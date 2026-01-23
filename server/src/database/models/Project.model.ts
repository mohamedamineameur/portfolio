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
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare url: string | null;
  declare githubUrl: string | null;
  declare imageUrl: string | null;
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
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    githubUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
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
