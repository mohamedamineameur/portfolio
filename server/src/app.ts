import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import { sessionMiddleware } from "./config/session.js";
import passport from "./config/passport.js";
import { corsOptions } from "./config/cors.js";
import { routes } from "./routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";

// Get current file directory (works in both dev and production)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Calculate path to client/dist
// In dev: __dirname = server/src -> ../../client/dist
// In prod: __dirname = server/dist/src -> ../../client/dist
// Fallback: use process.cwd() which should be server/ when running from server/
let clientDistPath = path.resolve(__dirname, "../../client/dist");
// Verify the path exists, if not try alternative
if (!existsSync(clientDistPath)) {
  // Try from process.cwd() (should be server/)
  const altPath = path.resolve(process.cwd(), "../client/dist");
  if (existsSync(altPath)) {
    clientDistPath = altPath;
  }
}

export const app = express();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

// Rate limiting
app.use("/api", apiLimiter);

// Routes
app.use("/api", routes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Serve static files from frontend build
app.use(express.static(clientDistPath));

// 404 handler for API routes
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    res.status(404).json({ error: "Route not found" });
    return;
  }
  next();
});

// SPA fallback: serve index.html for all non-API routes
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

// Error handling (must be last)
app.use(errorMiddleware);
