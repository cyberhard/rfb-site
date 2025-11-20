// src/app/api/auth/callback/vk/route.ts
import { NextResponse } from "next/server";

const VK_CLIENT_ID = process.env.VK_CLIENT_ID!;
const VK_CLIENT_SECRET = process.env.VK_CLIENT_SECRET!;
const VK_REDIRECT_URI = "https://rusfurbal.ru/api/auth/callback/vk";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const device_id = url.searchParams.get("device_id");
    const expires_in = url.searchParams.get("expires_in");

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    // Обмен code на access_token
    const tokenRes = await fetch(
      `https://oauth.vk.com/access_token?client_id=${VK_CLIENT_ID}&client_secret=${VK_CLIENT_SECRET}&redirect_uri=${VK_REDIRECT_URI}&code=${code}`,
      { method: "GET" }
    );

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return NextResponse.json({ error: tokenData.error_description }, { status: 400 });
    }

    // tokenData содержит access_token, user_id, expires_in
    // Здесь можно сохранить его в БД или сессии
    return NextResponse.json({
      success: true,
      tokenData,
      state,
      device_id,
      expires_in,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
