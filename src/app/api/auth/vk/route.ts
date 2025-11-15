// app/api/auth/vk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fetch from 'node-fetch';

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
    const email = vkUser.email || null;
    const avatar = vkUser.photo_100 || null;

    // Upsert пользователя в Postgres
    const upsertQuery = `
      INSERT INTO users (vk_id, name, email, avatar, role)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (vk_id)
      DO UPDATE SET name = $2, email = $3, avatar = $4
      RETURNING *;
    `;

    const values = [vkUser.id, name, email, avatar, 'user'];

    const result = await query(upsertQuery, values);
    const user = result.rows[0];

    return NextResponse.json({ user });
  } catch (err) {
    console.error('VK auth error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
