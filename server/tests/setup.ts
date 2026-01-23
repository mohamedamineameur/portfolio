import { sequelize } from "../src/database/sequelize.js";
// Import models to ensure they are registered and associations are initialized
import "../src/database/models/index.js";

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

afterEach(async () => {
  await sequelize.drop();
});

afterAll(async () => {
  await sequelize.close();
});
