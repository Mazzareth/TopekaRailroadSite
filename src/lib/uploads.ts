import "server-only";
import { randomUUID } from "crypto";
import { adminBucket } from "@/lib/firebase/admin";

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const IMAGE_NAME_PATTERN = /\.(avif|gif|heic|heif|jpe?g|png|webp)$/i;

export class UploadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadValidationError";
  }
}

function cleanFileName(name: string): string {
  const fallback = "image";
  const cleaned = name
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);

  return cleaned || fallback;
}

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/") || IMAGE_NAME_PATTERN.test(file.name);
}

function downloadUrl(path: string, token: string): string {
  const bucket = encodeURIComponent(adminBucket.name);
  const object = encodeURIComponent(path);
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${object}?alt=media&token=${token}`;
}

export const UPLOAD_FOLDERS = ["blog", "gallery", "board", "brand"] as const;

export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export async function deleteUploadedFile(path: string | null | undefined): Promise<void> {
  const cleanPath = typeof path === "string" ? path.trim() : "";
  if (!cleanPath) return;

  await adminBucket.file(cleanPath).delete({ ignoreNotFound: true });
}

export async function uploadImageFile(file: File, folder: UploadFolder) {
  if (!file || file.size === 0) {
    throw new UploadValidationError("Choose an image before uploading.");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new UploadValidationError("Images must be 10 MB or smaller.");
  }

  if (!isImageFile(file)) {
    throw new UploadValidationError("Only image files can be uploaded.");
  }

  const safeName = cleanFileName(file.name);
  const path = `${folder}/${Date.now()}-${randomUUID()}-${safeName}`;
  const token = randomUUID();
  const contentType = file.type || "application/octet-stream";
  const bytes = Buffer.from(await file.arrayBuffer());

  await adminBucket.file(path).save(bytes, {
    resumable: false,
    contentType,
    metadata: {
      cacheControl: "public, max-age=31536000",
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  });

  return {
    url: downloadUrl(path, token),
    path,
    contentType,
    size: file.size,
    originalName: file.name,
  };
}
