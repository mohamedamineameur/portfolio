import express from "express";
import cors from "cors";
import { sessionMiddleware } from "./config/session.js";
import passport from "./config/passport.js";
import { corsOptions } from "./config/cors.js";
import { routes } from "./routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";

export const app = express();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting
app.use("/api", apiLimiter);

// Routes
app.use("/api", routes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Error handling (must be last)
app.use(errorMiddleware);
