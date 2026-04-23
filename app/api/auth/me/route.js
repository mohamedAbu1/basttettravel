import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sb_access")?.value;
  console.log("this me",token)
  if (!token) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }
  return new Response(JSON.stringify({ message: "Token موجود" }), { status: 200 });
}
