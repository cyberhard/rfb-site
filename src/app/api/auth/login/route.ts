import { NextResponse } from "next/server";
import { exchangeVKCode, getVKUserInfo } from "@/lib/vk";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { signJWT } from "@/lib/jwt";

export async function POST(req: Request) {
  const { code, device_id } = await req.json();
  
  const vkTokens = await exchangeVKCode(code, device_id);
  const vkUser = await getVKUserInfo(vkTokens.access_token);

  const existing = await db.select().from(users).where(eq(users.vkId, Number(vkUser.id)));

  let user;

  if (existing.length > 0) {
    user = existing[0];

    await db.update(users)
      .set({
        avatarUrl: vkUser.photo_400_orig,
        firstName: vkUser.first_name,
        lastName: vkUser.last_name,
        screenName: vkUser.screen_name,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));
  } else {
    const inserted = await db.insert(users).values({
      vkId: vkUser.id,
      avatarUrl: vkUser.photo_400_orig,
      firstName: vkUser.first_name,
      lastName: vkUser.last_name,
      screenName: vkUser.screen_name,
    }).returning();

    user = inserted[0];
  }

  const token = signJWT({ id: user.id });

  const response = NextResponse.json(user);
  response.cookies.set("token", token, { httpOnly: true, secure: true, sameSite: "strict", path: "/" });

  return response;
}
