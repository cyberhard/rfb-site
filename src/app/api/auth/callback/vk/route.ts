// src/app/api/auth/callback/vk/route.ts
import { NextResponse } from "next/server";

const CLIENT_ID = process.env.VK_CLIENT_ID!;
const CLIENT_SECRET = process.env.VK_CLIENT_SECRET!;
const REDIRECT_URI = "https://rusfurbal.ru/api/auth/callback/vk";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const code = url.searchParams.get("code");
    const device_id = url.searchParams.get("device_id");
    const state = url.searchParams.get("state");
    const code_verifier = url.searchParams.get("verifier");

    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    if (!code_verifier) {
      return NextResponse.json({ error: "Missing code_verifier" }, { status: 400 });
    }

    // VK ID token exchange
    const tokenRes = await fetch("https://id.vk.com/oauth2/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code_verifier,
        device_id: device_id ?? "",
      }),
    });

    const data = await tokenRes.json();

    if (!tokenRes.ok) {
      return NextResponse.json(
        {
          error: data.error_description || data.error || "VK token error",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      vk: data,
      state,
      device_id,
    });

  } catch (error) {
    console.error("VK CALLBACK ERROR", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
