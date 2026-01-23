import bcrypt from "bcrypt";
import { env } from "../config/env.js";

const SALT_ROUNDS = env.BCRYPT_SALT_ROUNDS as number;

export const hashPassword = {
  hash: async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  compare: async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
  },
};
