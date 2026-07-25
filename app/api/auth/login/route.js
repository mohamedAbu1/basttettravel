// file: app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const db = await connectDB();
    const { email, password } = await request.json();

    console.log("📩 Step 1: Received login request", { email });

    // ✅ البحث عن المستخدم
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 401 });
    }

    const user = rows[0];
    console.log("👤 Step 2: User retrieved", { user });

    // ✅ التحقق من كلمة المرور
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
    }

    // ✅ إنشاء التوكينات
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      avatar_url: user.avatar_url,
      gender: user.gender,
    };

    const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // ✅ تجهيز الرد بصيغة JSON واضحة للتطبيق
    return NextResponse.json(
      {
        message: "تم تسجيل الدخول بنجاح",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          gender: user.gender,
          avatar_url: user.avatar_url,
        },
        accessToken,
        refreshToken,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("💥 Internal error", e);
    return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 });
  }
}
