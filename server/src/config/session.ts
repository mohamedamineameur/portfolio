import session from "express-session";
import connectSessionSequelize from "connect-session-sequelize";
import { sequelize } from "../database/sequelize.js";
import { env } from "./env.js";

const SequelizeStore = connectSessionSequelize(session.Store);

export const sessionMiddleware = session({
  name: "session_id",
  secret: env.SESSION_SECRET,
  store: new SequelizeStore({ db: sequelize }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "lax" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
});
