// app/api/auth/vk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { access_token } = await req.json();

    if (!access_token) {
      return NextResponse.json({ error: 'Missing access_token' }, { status: 400 });
    }

    // Получаем данные пользователя из VK
    const vkRes = await fetch(
      `https://api.vk.com/method/users.get?access_token=${access_token}&v=5.131&fields=photo_100,email`
    );
    const vkData = await vkRes.json();

    if (vkData.error) {
      return NextResponse.json({ error: 'Invalid VK token' }, { status: 401 });
    }

    const vkUser = vkData.response[0];
    const name = `${vkUser.first_name} ${vkUser.last_name}`;
    const email = vkUser.email || `${vkUser.id}@vk.com`; // если email нет, делаем фиктивный
    const avatar = vkUser.photo_100 || null;

    // Upsert пользователя
    const upsertQuery = `
      INSERT INTO users (email, name, role)
      VALUES ($1, $2, $3)
      ON CONFLICT (email)
      DO UPDATE SET name = $2, updated_at = NOW()
      RETURNING id, email, name, role, created_at, updated_at;
    `;
    const values = [email, name, 'participant'];

    const result = await query(upsertQuery, values);
    const user = result.rows[0];

    return NextResponse.json({ user, avatar });
  } catch (err) {
    console.error('VK auth error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
