import { Technology } from "../../src/database/models/Technology.model.js";

export async function createTechnology(data?: {
  name?: string;
  icon?: string | null;
  category?: string | null;
}): Promise<Technology> {
  const name = data?.name || "TypeScript";
  const icon = data?.icon !== undefined ? data.icon : "typescript-icon";
  const category = data?.category !== undefined ? data.category : "Language";

  return Technology.create({
    name,
    icon,
    category,
  });
}
