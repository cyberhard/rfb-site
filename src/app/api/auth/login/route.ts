// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { signJWT } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { access_token } = await req.json();

    if (!access_token) {
      return NextResponse.json({ error: "Missing access_token" }, { status: 400 });
    }

    // Получаем инфу о пользователе VK напрямую
    const res = await fetch(
      `https://api.vk.com/method/users.get?fields=photo_400_orig,screen_name&access_token=${access_token}&v=5.131`
    );

    const data = await res.json();
    if (!data.response || !data.response[0]) {
      return NextResponse.json({ error: "Invalid VK response" }, { status: 401 });
    }

    const vkUser = data.response[0];

    // Проверяем пользователя в базе
    let user = await db.select().from(users).where(eq(users.vkId, Number(vkUser.id)));

    let finalUser;
    if (user.length > 0) {
      finalUser = user[0];

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

    const token = signJWT({ id: finalUser.id });

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
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
