import { User } from "../../database/models/User.model.js";
import { hashPassword } from "../../utils/hash.js";
import { HttpError } from "../../utils/httpError.js";

export const authService = {
  async register(email: string, password: string): Promise<User> {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new HttpError("User already exists", 400);
    }

    const hashedPassword = await hashPassword.hash(password);
    return User.create({
      email,
      password: hashedPassword,
    });
  },

  async login(email: string, password: string): Promise<User> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new HttpError("Invalid credentials", 401);
    }

    const isValid = await hashPassword.compare(password, user.password);
    if (!isValid) {
      throw new HttpError("Invalid credentials", 401);
    }

    return user;
  },
};
