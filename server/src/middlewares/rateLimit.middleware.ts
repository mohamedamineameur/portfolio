import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

// Disable rate limiting in test environment
const createLimiter = (config: Parameters<typeof rateLimit>[0]) => {
  if (env.NODE_ENV === "test") {
    return (_req: unknown, _res: unknown, next: () => void) => next();
  }
  return rateLimit(config);
};

export const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

export const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many authentication attempts, please try again later.",
});

export const contactLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 contact form submissions per hour
  message: "Too many contact form submissions, please try again later.",
});
