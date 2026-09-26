import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const phone = String(body?.phone || "").trim();
    const message = String(body?.message || "").trim();

    if (!name || !email || !phone || !message) {
      return Response.json({ success: false, message: "Please complete all required fields." }, { status: 400 });
    }

    if (!/^\S+@\S+\.\S+$/.test(email) || message.length > 5000) {
      return Response.json({ success: false, message: "Please check the submitted information." }, { status: 400 });
    }

    // Support both the current environment names and the legacy GMAIL_* names.
    // This keeps the contact form compatible with the existing deployment config.
    const mailUser = process.env.EMAIL_USER || process.env.GMAIL_USER;
    const mailPass = process.env.EMAIL_PASS || process.env.GMAIL_PASS;

    if (!mailUser || !mailPass) {
      return Response.json({ success: false, message: "Contact service is not configured." }, { status: 503 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    });

    await transporter.sendMail({
      from: mailUser,
      to: mailUser,
      replyTo: email,
      subject: `رسالة جديدة من ${name}`,
      text: `
        الاسم: ${name}
        الهاتف: ${phone}
        البريد: ${email}
        الرسالة: ${message}
      `,
    });

    return Response.json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("❌ خطأ أثناء الإرسال:", error);
    return Response.json({ success: false, message: "Unable to send the message." }, { status: 500 });
  }
}
