import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { signJWT } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    const { vkId, firstName, lastName, screenName, avatarUrl, email } = await req.json();

    if (!vkId) return NextResponse.json({ error: 'Missing vkId' }, { status: 400 });

    let user = await db.select().from(users).where(eq(users.vkId, vkId));
    let finalUser;

    if (user.length > 0) {
      finalUser = user[0];
      await db.update(users)
        .set({ firstName, lastName, screenName, avatarUrl, email, updatedAt: new Date() })
        .where(eq(users.id, finalUser.id));
    } else {
      const inserted = await db.insert(users).values({
        vkId,
        firstName,
        lastName,
        screenName,
        avatarUrl,
        email,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      finalUser = inserted[0];
    }

    const token = signJWT({ id: finalUser.id });
    const response = NextResponse.json({ user: finalUser });
    response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 60 * 60 * 24 * 30 });
    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
