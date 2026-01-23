import { Sequelize } from "sequelize";
import { env } from "../config/env.js";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage:
    env.NODE_ENV === "test"
      ? ":memory:"
      : env.DB_STORAGE,
  logging: false,
});
