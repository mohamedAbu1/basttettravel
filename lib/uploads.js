import path from "path";

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
export const MAX_CHAT_FILE_SIZE = 25 * 1024 * 1024;

export const CHAT_ATTACHMENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "text/plain",
  "application/zip",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

/** Validates uploaded images before they are written to public storage. */
export function validateImageFile(file) {
  if (!file || typeof file.arrayBuffer !== "function") {
    return "No valid image was uploaded";
  }

  if (!file.type?.startsWith("image/")) {
    return "Only image files are allowed";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "Image size must not exceed 10 MB";
  }

  return null;
}

/** Prevents path traversal while keeping the existing public URL structure. */
export function safeImageName(fileName) {
  const baseName = path.basename(String(fileName || ""));
  const safeName = baseName.replace(/[^a-zA-Z0-9._-]/g, "-");
  return safeName || `image-${Date.now()}.webp`;
}

export function validateChatFile(file) {
  if (!file || typeof file.arrayBuffer !== "function") return "No valid file was uploaded";
  if (!CHAT_ATTACHMENT_TYPES.has(file.type)) return "This file type is not supported";
  if (file.size > MAX_CHAT_FILE_SIZE) return "Files must not exceed 25 MB";
  return null;
}

export function safeAttachmentName(fileName) {
  const baseName = path.basename(String(fileName || "attachment"));
  return baseName.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 160) || "attachment";
}
