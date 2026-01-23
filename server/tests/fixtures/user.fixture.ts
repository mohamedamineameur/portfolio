import { User } from "../../src/database/models/User.model.js";
import { hashPassword } from "../../src/utils/hash.js";

export async function createUser(data?: {
  email?: string;
  password?: string;
  role?: string;
}): Promise<User> {
  const email = data?.email || "test@test.com";
  const password = data?.password || "password123";
  const role = data?.role || "user";

  return User.create({
    email,
    password: await hashPassword.hash(password),
    role,
  });
}
