import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";

export async function POST(req) {
  try {
    const authorizationError = requireAdmin(req);
    if (authorizationError) return authorizationError;
    const body = await req.json();
    const { expoPushToken, title, bodyText } = body;

    const message = {
      to: expoPushToken,
      sound: "default",
      title,
      body: bodyText,
      data: { screen: "chat" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
