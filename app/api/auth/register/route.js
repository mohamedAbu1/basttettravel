// file: app/api/auth/register/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ روابط الصور المخزنة على هوستنجر (iamges)
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
    console.log("🔵 [API REGISTER] استلام طلب جديد");

    const db = await connectDB();
    console.log("🔵 [API REGISTER] الاتصال بقاعدة البيانات ناجح");

    const body = await request.json();
    console.log("🔵 [API REGISTER] البيانات المستلمة:", body);

    const { name, email, password, gender } = body;

    // ✅ تحقق من البريد إذا كان موجود مسبقًا
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    console.log("🔵 [API REGISTER] نتيجة البحث عن البريد:", existing);

    if (existing.length > 0) {
      console.warn("⚠️ [API REGISTER] البريد مستخدم بالفعل");
      return NextResponse.json({ error: "البريد مستخدم بالفعل" }, { status: 400 });
    }

    // ✅ تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔵 [API REGISTER] كلمة المرور مشفرة");

    // ✅ اختيار صورة عشوائية
    const avatarUrl = getAvatarByGender(gender);
    console.log("🔵 [API REGISTER] الصورة المختارة:", avatarUrl);

    // ✅ إدخال المستخدم في قاعدة البيانات
    await db.query(
      "INSERT INTO users (id, name, email, password, gender, role, avatar_url, created_at) VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW())",
      [name, email, hashedPassword, gender, "USER", avatarUrl],
    );
    console.log("✅ [API REGISTER] المستخدم أُضيف لقاعدة البيانات");

    // ✅ جلب بيانات المستخدم الجديد
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    const newUser = rows[0];
    console.log("🔵 [API REGISTER] المستخدم الجديد:", newUser);

    // ✅ إنشاء JWT token
    const accessToken = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log("🔵 [API REGISTER] التوكين تم إنشاؤه");

    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          gender: newUser.gender,
          avatar_url: newUser.avatar_url,
          role: newUser.role,
          status: newUser.status,
        },
        accessToken,
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("❌ [API REGISTER] خطأ داخلي:", e);
    return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 });
  }
}
