import fs from "fs/promises";
import path from "path";

const MIME_TYPES = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

export async function GET(_request, { params }) {
  const { filename } = await params;
  const safeFilename = path.basename(String(filename || ""));
  const filePath = path.join(process.cwd(), "public", "iamges", safeFilename);

  try {
    const file = await fs.readFile(filePath);
    const extension = path.extname(safeFilename).toLowerCase();

    return new Response(file, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": MIME_TYPES[extension] || "application/octet-stream",
      },
    });
  } catch {
    return new Response("Image not found", { status: 404 });
  }
}
