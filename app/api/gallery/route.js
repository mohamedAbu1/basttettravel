// api/gallery/route.js
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const galleryFiles = formData.getAll("gallery_images");
    const folder = "iamges";
    const uploadDir = path.join(process.cwd(), "public", folder);

    let galleryImageObjects = [];

    if (galleryFiles?.length > 0) {
      for (const file of galleryFiles) {
        const originalName = file.name;
        const uploadPath = path.join(uploadDir, originalName);

        if (!fs.existsSync(uploadPath)) {
          fs.writeFileSync(uploadPath, Buffer.from(await file.arrayBuffer()));
        }

        const fileUrl = `https://wasettravel.com/${folder}/${originalName}`;

        // ✅ استقبل أسماء اللغات من الـ formData
        const nameTranslations = {
          en: formData.get(`name_en_${originalName}`) || originalName,
          ar: formData.get(`name_ar_${originalName}`) || "",
          fr: formData.get(`name_fr_${originalName}`) || "",
          de: formData.get(`name_de_${originalName}`) || "",
          it: formData.get(`name_it_${originalName}`) || "",
          zh: formData.get(`name_zh_${originalName}`) || "",
          es: formData.get(`name_es_${originalName}`) || "",
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
