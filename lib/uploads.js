import path from "path";

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

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
