import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    console.log("📩 البيانات المستلمة:", body);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    console.log("🚀 محاولة إرسال البريد...");

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.GMAIL_USER,
      subject: `رسالة جديدة من ${name}`,
      text: `
        الاسم: ${name}
        الهاتف: ${phone}
        البريد: ${email}
        الرسالة: ${message}
      `,
    });

    console.log("✅ البريد تم إرساله بنجاح");

    return new Response(JSON.stringify({ success: true, message: "تم إرسال الرسالة بنجاح ✅" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ خطأ أثناء الإرسال:", error);
    return new Response(JSON.stringify({ success: false, message: "فشل الإرسال ❌", error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
