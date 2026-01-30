import multer from "multer";
import path from "path";
import { env } from "../config/env.js";
import { Request } from "express";

// Use memory storage for GCS uploads (file is stored in buffer)
const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: env.MAX_FILE_SIZE,
  },
  fileFilter,
});

/**
 * Generate a unique filename for uploads
 */
export function generateFilename(originalname: string): string {
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const ext = path.extname(originalname);
  const name = path.basename(originalname, ext);
  return `${name}-${uniqueSuffix}${ext}`;
}
