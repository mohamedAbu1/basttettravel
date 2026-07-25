// api/cover/route.js
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const coverFile = formData.get("cover_image");
    const folder = "iamges";
    const uploadDir = path.join(process.cwd(), "public", folder);

    let coverImageUrl = null;

    if (coverFile) {
      const originalName = coverFile.name;
      const uploadPath = path.join(uploadDir, originalName);

      if (!fs.existsSync(uploadPath)) {
        fs.writeFileSync(uploadPath, Buffer.from(await coverFile.arrayBuffer()));
      }

      coverImageUrl = `https://basttettravel.com/${folder}/${originalName}`;
    }

    return new Response(JSON.stringify({ success: true, cover_image: coverImageUrl }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
