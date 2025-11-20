import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) return NextResponse.json({ error: "No code provided" }, { status: 400 });

  try {
    const res = await fetch("https://oauth.vk.com/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.VK_CLIENT_ID!,
        client_secret: process.env.VK_CLIENT_SECRET!,
        redirect_uri: "https://rusfurbal.ru/api/auth/callback/vk",
        code: code,
        // Для code_v2 иногда требуется указать grant_type
        grant_type: "authorization_code",
      }),
    });

    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ error: data.error_description || data.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
