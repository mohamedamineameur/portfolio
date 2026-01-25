import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../sequelize.js";

export class Technology extends Model<
  InferAttributes<Technology>,
  InferCreationAttributes<Technology>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare icon: string | null;
  declare category: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Association methods (added by Sequelize)
  declare setProjects: (
    projects: import("./Project.model.js").Project | import("./Project.model.js").Project[] | null
  ) => Promise<void>;
  declare getProjects: () => Promise<import("./Project.model.js").Project[]>;
  declare addProjects: (projects: import("./Project.model.js").Project | import("./Project.model.js").Project[]) => Promise<void>;
  declare removeProjects: (projects: import("./Project.model.js").Project | import("./Project.model.js").Project[]) => Promise<void>;
}

Technology.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: "Technology",
    tableName: "technologies",
  }
);
