import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const token = req.headers.get("cookie")?.match(/token=([^;]+)/)?.[1];

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const decoded = verifyJWT(token) as { id: number };

  const [user] = await db.select().from(users).where(eq(users.id, decoded.id));

  return NextResponse.json(user);
}
