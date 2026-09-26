import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { requireAdmin } from "@/lib/auth/admin";
import { safeImageName, validateImageFile } from "@/lib/uploads";

export async function POST(req) {
  const authorizationError = requireAdmin(req);
  if (authorizationError) return authorizationError;

  const formData = await req.formData();
  const file = formData.get("file");
  const validationError = validateImageFile(file);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public/iamges"); // مجلد iamges

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = safeImageName(file.name);
  const filePath = path.join(uploadDir, fileName);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, buffer);
  }

  // رابط دائم على موقعك
  const publicUrl = `/iamges/${fileName}`;

  return NextResponse.json({ url: publicUrl });
}
