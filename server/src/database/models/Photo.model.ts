import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../sequelize.js";

export class Photo extends Model<
  InferAttributes<Photo>,
  InferCreationAttributes<Photo>
> {
  declare id: CreationOptional<string>;
  declare url: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Photo.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrlOrPath(value: string): void {
          // Accept both absolute URLs (http://, https://) and relative paths (starting with /)
          if (
            !value.startsWith("http://") &&
            !value.startsWith("https://") &&
            !value.startsWith("/")
          ) {
            throw new Error("URL must be an absolute URL (http:// or https://) or a relative path (starting with /)");
          }
        },
      },
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
    modelName: "Photo",
    tableName: "photos",
  }
);
