import dotenv from "dotenv";

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3000", 10),
  SERVER_URL: process.env.SERVER_URL || `http://localhost:${process.env.PORT || "3000"}`,
  SESSION_SECRET: process.env.SESSION_SECRET || "dev-secret-change-in-production",
  // PostgreSQL configuration (uses DATABASE_URL connection string)
  DATABASE_URL: process.env.DATABASE_URL || "",
  DB_SSL: process.env.DB_SSL === "true",
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587", 10),
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  EMAIL_FROM: process.env.EMAIL_FROM || "",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || "5242880", 10),
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10),
  GMAIL_CLIENT_ID: process.env.GMAIL_CLIENT_ID || "",
  GMAIL_CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET || "",
  GMAIL_REFRESH_TOKEN: process.env.GMAIL_REFRESH_TOKEN || "",
  // Google Cloud Storage configuration
  GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME || "",
  GCS_PROJECT_ID: process.env.GCS_PROJECT_ID || "",
  // JSON content of the service account key (for cloud deployments)
  GCP_KEY_JSON: process.env.GCP_KEY_JSON || "",
} as const;
