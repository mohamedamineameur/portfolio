import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync, readFileSync } from "fs";
import { sessionMiddleware } from "./config/session.js";
import passport from "./config/passport.js";
import { corsOptions } from "./config/cors.js";
import { routes } from "./routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";
import { profileService } from "./modules/profile/profile.service.js";
import { env } from "./config/env.js";

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

// Trust proxy (required in production behind nginx/Cloudflare so req.secure and cookies work)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Images are served directly from GCS (no local uploads)

// Rate limiting
app.use("/api", apiLimiter);

// Routes
app.use("/api", routes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Serve static files from frontend build (index: false so GET "/" hits the handler below for og:image injection)
app.use(express.static(clientDistPath, { index: false }));

// 404 handler for API routes
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    res.status(404).json({ error: "Route not found" });
    return;
  }
  next();
});

// SPA fallback: serve index.html with profile photo in og:image / twitter:image for crawlers
app.get("*", async (_req, res) => {
  const indexPath = path.join(clientDistPath, "index.html");
  if (!existsSync(indexPath)) {
    res.status(404).send("Not found");
    return;
  }
  let html = readFileSync(indexPath, "utf-8");

  try {
    const profile = await profileService.findOne();
    const photoUrl = (profile as { photo?: { url?: string } })?.photo?.url;
    if (photoUrl) {
      const absoluteImageUrl =
        photoUrl.startsWith("http://") || photoUrl.startsWith("https://")
          ? photoUrl
          : `${env.SERVER_URL.replace(/\/$/, "")}${photoUrl.startsWith("/") ? photoUrl : `/${photoUrl}`}`;

      html = html.replace(
        /<meta\s+property="og:image"\s+content="[^"]*"/,
        `<meta property="og:image" content="${absoluteImageUrl}"`
      );
      html = html.replace(
        /<meta\s+name="twitter:image"\s+content="[^"]*"/,
        `<meta name="twitter:image" content="${absoluteImageUrl}"`
      );
    }
  } catch {
    // Keep default icon if profile fetch fails
  }

  res.type("html").send(html);
});

// Error handling (must be last)
app.use(errorMiddleware);
