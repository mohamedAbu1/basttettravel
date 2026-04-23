// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { UserSchema } from "@/lib/schemas/userSchema";
import { maleAvatars, femaleAvatars } from "@/constants/images";

// ✅ دالة لاختيار صورة عشوائية حسب الجنس
function getAvatarByGender(gender) {
  let randomFile;
  if (gender?.toLowerCase() === "male") {
    randomFile = maleAvatars[Math.floor(Math.random() * maleAvatars.length)];
  } else if (gender?.toLowerCase() === "female") {
    randomFile =
      femaleAvatars[Math.floor(Math.random() * femaleAvatars.length)];
  } else {
    randomFile = "default.webp";
  }
  const { data } = supabase.storage.from("avatars").getPublicUrl(randomFile);
  return data.publicUrl;
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("📩 بيانات الطلب:", body);

    // ✅ التحقق من البيانات باستخدام UserSchema
    const parsed = UserSchema.safeParse(body);
    if (!parsed.success) {
      console.error("❌ UserSchema validation error:", parsed.error);
      return NextResponse.json(
        { error: "البيانات غير صالحة" },
        { status: 400 },
      );
    }

    const { name, email, password, gender } = parsed.data;
    console.log("Register payload:", { name, email, password, gender });

    // ✅ الحصول على صورة عشوائية
    const avatarUrl = getAvatarByGender(gender);

    // ✅ تسجيل المستخدم في Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          gender,
          role: "USER",
          avatar: avatarUrl,
        },
      },
    });

    if (error) {
      console.error("❌ Supabase signUp error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // ✅ الاستجابة النهائية
    return NextResponse.json({
      message: "تم إنشاء الحساب بنجاح",
      user: data.user,
      session: data.session,
    });
  } catch (e) {
    console.error("❌ خطأ داخلي:", e);
    return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 });
  }
}
