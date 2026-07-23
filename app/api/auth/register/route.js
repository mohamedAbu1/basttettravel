// file: app/api/auth/register/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";

// ✅ روابط الصور المخزنة على هوستنجر
const maleAvatars = [
  "https://basttettravel.com/iamges/3d-avatar-cartoon-character_113255-93687.webp",
  "https://basttettravel.com/iamges/blds.webp",
  "https://basttettravel.com/iamges/kbj.webp",
  "https://basttettravel.com/iamges/klhasd.webp",
  "https://basttettravel.com/iamges/memoji-happy-man-white-background-emoji_826801-6839.webp",
  "https://basttettravel.com/iamges/nss.webp",
  "https://basttettravel.com/iamges/technical-writer-digital-avatar-generative-ai_934475-9098.webp",
  "https://basttettravel.com/iamges/3d-avatar-cartoon-character_113255-92170.webp",
  "https://basttettravel.com/iamges/usa.webp",
];

const femaleAvatars = [
  "https://basttettravel.com/iamges/3d-rendered-photo-woman-wearing-glasses-smiles-camera_1103059-4106.webp",
  "https://basttettravel.com/iamges/3d-rendered-photo-woman-wearing-glasses-smiles-camera_1103059-4231.webp",
  "https://basttettravel.com/iamges/3d-rendered-photo-woman-wearing-glasses-smiles-camera_1103059-4319.webp",
  "https://basttettravel.com/iamges/3d-rendered-photo-woman-wearing-glasses-smiles-camera_1103059-4400.webp",
  "https://basttettravel.com/iamges/bjlsd.webp",
  "https://basttettravel.com/iamges/business-woman-3d-cartoon-avatar-portrait_839035-196331.webp",
  "https://basttettravel.com/iamges/klnsd.webp",
  "https://basttettravel.com/iamges/woman-human-head-illustration_862994-10854.webp",
  "https://basttettravel.com/iamges/young-business-woman-with-nerd-glasses-grey-background-3d-rendering_1026950-41027.webp",
  "https://basttettravel.com/iamges/young-smiling-woman-mia-avatar-3d-vector-people-character-illustration-cartoon-minimal-style_1029476-291545.webp",
];

// ✅ دالة لاختيار صورة عشوائية حسب الجنس
function getAvatarByGender(gender) {
  if (gender?.toLowerCase() === "male") {
    return maleAvatars[Math.floor(Math.random() * maleAvatars.length)];
  } else if (gender?.toLowerCase() === "female") {
    return femaleAvatars[Math.floor(Math.random() * femaleAvatars.length)];
  }
  return "https://basttettravel.com/avatars/default/default.webp";
}

export async function POST(request) {
  try {
    const db = await connectDB();

    const body = await request.json();
    const { name, email, password, gender } = body;

    // ✅ تحقق من البريد إذا كان موجود مسبقًا
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "البريد مستخدم بالفعل" },
        { status: 400 },
      );
    }

    // ✅ تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ اختيار صورة عشوائية
    const avatarUrl = getAvatarByGender(gender);

    // ✅ إدخال المستخدم في قاعدة البيانات
    await db.query(
      "INSERT INTO users (id, name, email, password, gender, role, avatar_url, created_at) VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW())",
      [name, email, hashedPassword, gender, "USER", avatarUrl],
    );

    return NextResponse.json(
      { message: "تم إنشاء الحساب بنجاح" },
      { status: 201 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 });
  }
}
