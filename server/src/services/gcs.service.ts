import { Storage } from "@google-cloud/storage";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

let storage: Storage | null = null;

/**
 * Initialize GCS client
 * Uses GCP_KEY_JSON env var (JSON string) for credentials
 */
function getStorage(): Storage {
  if (!storage) {
    if (env.GCP_KEY_JSON) {
      // Parse credentials from JSON string in environment variable
      const credentials = JSON.parse(env.GCP_KEY_JSON) as {
        client_email: string;
        private_key: string;
      };
      storage = new Storage({
        projectId: env.GCS_PROJECT_ID || undefined,
        credentials,
      });
    } else {
      // Fallback to GOOGLE_APPLICATION_CREDENTIALS file path
      storage = new Storage({
        projectId: env.GCS_PROJECT_ID || undefined,
      });
    }
  }
  return storage;
}

/**
 * Check if GCS is configured
 */
export function isGcsConfigured(): boolean {
  return !!env.GCS_BUCKET_NAME && !!env.GCS_PROJECT_ID;
}

/**
 * Upload a file buffer to GCS
 * @param buffer - File buffer
 * @param filename - Destination filename
 * @param mimetype - File MIME type
 * @returns Public URL of the uploaded file
 */
export async function uploadToGcs(
  buffer: Buffer,
  filename: string,
  mimetype: string
): Promise<string> {
  if (!isGcsConfigured()) {
    throw new Error("GCS is not configured. Set GCS_BUCKET_NAME and GCS_PROJECT_ID.");
  }

  const gcs = getStorage();
  const bucket = gcs.bucket(env.GCS_BUCKET_NAME);
  const blob = bucket.file(`uploads/${filename}`);

  await blob.save(buffer, {
    metadata: {
      contentType: mimetype,
    },
    resumable: false,
  });

  // With uniform bucket-level access, public access is configured at bucket level
  // No need to call makePublic() on individual files
  const publicUrl = `https://storage.googleapis.com/${env.GCS_BUCKET_NAME}/uploads/${filename}`;
  logger.info(`File uploaded to GCS: ${publicUrl}`);

  return publicUrl;
}

/**
 * Delete a file from GCS
 * @param url - Public URL or path of the file
 */
export async function deleteFromGcs(url: string): Promise<void> {
  if (!isGcsConfigured()) {
    logger.warn("GCS not configured, skipping delete");
    return;
  }

  try {
    const gcs = getStorage();
    const bucket = gcs.bucket(env.GCS_BUCKET_NAME);

    // Extract filename from URL
    // URL format: https://storage.googleapis.com/BUCKET/uploads/filename
    let filename: string;
    if (url.startsWith("https://storage.googleapis.com/")) {
      const urlParts = url.split(`${env.GCS_BUCKET_NAME}/`);
      filename = urlParts[1] || "";
    } else if (url.startsWith("/uploads/")) {
      filename = `uploads${url.slice(8)}`; // Remove leading /uploads, add uploads/
    } else {
      filename = url;
    }

    if (filename) {
      await bucket.file(filename).delete();
      logger.info(`File deleted from GCS: ${filename}`);
    }
  } catch (error) {
    logger.error("Error deleting file from GCS:", error);
    // Don't throw - file might not exist
  }
}
