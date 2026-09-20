import path from "path";

const STORAGE_FOLDER = "basttettravel-chat-storage";

export function getChatUploadRoot() {
  const configuredRoot = process.env.CHAT_UPLOAD_DIR?.trim();
  if (configuredRoot) return path.resolve(configuredRoot);

  // Keep storage stable across application rebuilds. The old cwd-parent
  // fallback could point to a different directory after a deployment.
  const stableBase = process.env.HOME || process.env.USERPROFILE || path.resolve(process.cwd(), "..");
  return path.resolve(stableBase, STORAGE_FOLDER);
}

export function getLegacyChatUploadRoot() {
  return path.resolve(process.cwd(), "..", STORAGE_FOLDER);
}

export function resolveStoredAttachment(root, relativePath) {
  const normalizedRelativePath = String(relativePath || "").replace(/[\\/]+/g, path.sep);
  const resolvedRoot = path.resolve(root);
  const resolvedPath = path.resolve(resolvedRoot, normalizedRelativePath);
  if (resolvedPath === resolvedRoot || !resolvedPath.startsWith(`${resolvedRoot}${path.sep}`)) return null;
  return resolvedPath;
}
