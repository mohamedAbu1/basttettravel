// api/gallery/route.js
import fs from "fs";
import path from "path";
import { requireAdmin } from "@/lib/auth/admin";
import { safeImageName, validateImageFile } from "@/lib/uploads";

export async function POST(req) {
  const authorizationError = requireAdmin(req);
  if (authorizationError) return authorizationError;

  try {
    const formData = await req.formData();
    const galleryFiles = formData.getAll("gallery_images");
    const folder = "iamges";
    const uploadDir = path.join(process.cwd(), "public", folder);

    let galleryImageObjects = [];

    if (galleryFiles?.length > 0) {
      for (const file of galleryFiles) {
        const validationError = validateImageFile(file);
        if (validationError) {
          return new Response(JSON.stringify({ success: false, error: validationError }), { status: 400 });
        }

        const formFileName = file.name;
        const originalName = safeImageName(formFileName);
        const uploadPath = path.join(uploadDir, originalName);

        if (!fs.existsSync(uploadPath)) {
          fs.writeFileSync(uploadPath, Buffer.from(await file.arrayBuffer()));
        }

        const fileUrl = `https://basttettravel.com/${folder}/${originalName}`;

        // ✅ استقبل أسماء اللغات من الـ formData
        const nameTranslations = {
          en: formData.get(`name_en_${formFileName}`) || originalName,
          ar: formData.get(`name_ar_${formFileName}`) || "",
          fr: formData.get(`name_fr_${formFileName}`) || "",
          de: formData.get(`name_de_${formFileName}`) || "",
          it: formData.get(`name_it_${formFileName}`) || "",
          zh: formData.get(`name_zh_${formFileName}`) || "",
          es: formData.get(`name_es_${formFileName}`) || "",
        };

        galleryImageObjects.push({
          url: fileUrl,
          name: nameTranslations,
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, gallery_images: galleryImageObjects }),
      { status: 201 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
