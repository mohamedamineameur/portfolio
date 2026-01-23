import { User } from "../database/models/User.model.js";

declare global {
  namespace Express {
    interface User extends InstanceType<typeof User> {}
  }
}

export {};
