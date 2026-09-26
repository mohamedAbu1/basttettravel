// api/cover/route.js
import fs from "fs";
import path from "path";
import { requireAdmin } from "@/lib/auth/admin";
import { safeImageName, validateImageFile } from "@/lib/uploads";

export async function POST(req) {
  const authorizationError = requireAdmin(req);
  if (authorizationError) return authorizationError;

  try {
    const formData = await req.formData();
    const coverFile = formData.get("cover_image");
    const folder = "iamges";
    const uploadDir = path.join(process.cwd(), "public", folder);

    let coverImageUrl = null;

    if (coverFile) {
      const validationError = validateImageFile(coverFile);
      if (validationError) {
        return new Response(JSON.stringify({ success: false, error: validationError }), { status: 400 });
      }

      const originalName = safeImageName(coverFile.name);
      const uploadPath = path.join(uploadDir, originalName);

      if (!fs.existsSync(uploadPath)) {
        fs.writeFileSync(uploadPath, Buffer.from(await coverFile.arrayBuffer()));
      }

      coverImageUrl = `/${folder}/${originalName}`;
    }

    return new Response(JSON.stringify({ success: true, cover_image: coverImageUrl }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
