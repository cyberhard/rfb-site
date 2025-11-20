// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { signJWT } from "@/lib/jwt";

const VK_TOKEN_URL = "https://id.vk.com/oauth2/auth";
const VK_USER_URL = "https://api.vk.com/method/users.get";

interface VKExchangeResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  id_token: string;
  user_id: number;
}

interface VKUserResponse {
  id: number;
  first_name: string;
  last_name: string;
  screen_name: string;
  photo_400_orig: string;
}

// Обмен code → access_token
async function exchangeVKCode(code: string, deviceId: string): Promise<VKExchangeResponse> {
  const res = await fetch(VK_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      device_id: deviceId,
      client_id: process.env.VK_CLIENT_ID,
      client_secret: process.env.VK_CLIENT_SECRET,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`VK code exchange failed: ${res.status} ${text}`);
  }

  return await res.json();
}

// Получение информации о пользователе VK
async function getVKUserInfo(accessToken: string): Promise<VKUserResponse> {
  const url = new URL(VK_USER_URL);
  url.searchParams.set("fields", "photo_400_orig,screen_name");
  url.searchParams.set("access_token", accessToken);
  url.searchParams.set("v", "5.131");

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`VK user info failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  if (!data.response || !data.response[0]) {
    throw new Error(`VK user info invalid response`);
  }

  return data.response[0];
}

export async function POST(req: Request) {
  try {
    const { code, device_id } = await req.json();

    if (!code || !device_id) {
      return NextResponse.json({ error: "Missing code or device_id" }, { status: 400 });
    }

    // 1️⃣ Обмениваем code на access_token
    const vkTokens = await exchangeVKCode(code, device_id);

    // 2️⃣ Получаем инфу о пользователе
    const vkUser = await getVKUserInfo(vkTokens.access_token);

    // 3️⃣ Проверяем, есть ли пользователь в базе
    let user = await db.select().from(users).where(eq(users.vkId, Number(vkUser.id)));

    let finalUser;
    if (user.length > 0) {
      finalUser = user[0];

      // Обновляем данные
      await db.update(users)
        .set({
          avatarUrl: vkUser.photo_400_orig,
          firstName: vkUser.first_name,
          lastName: vkUser.last_name,
          screenName: vkUser.screen_name,
          updatedAt: new Date(),
        })
        .where(eq(users.id, finalUser.id));
    } else {
      const inserted = await db.insert(users).values({
        vkId: vkUser.id,
        avatarUrl: vkUser.photo_400_orig,
        firstName: vkUser.first_name,
        lastName: vkUser.last_name,
        screenName: vkUser.screen_name,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      finalUser = inserted[0];
    }

    // 4️⃣ Генерируем JWT
    const token = signJWT({ id: finalUser.id });

    // 5️⃣ Отправляем ответ с cookie
    const response = NextResponse.json({
      user: {
        id: finalUser.id,
        vkId: finalUser.vkId,
        firstName: finalUser.firstName,
        lastName: finalUser.lastName,
        screenName: finalUser.screenName,
        avatarUrl: finalUser.avatarUrl,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 дней
    });

    return response;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
