// app/api/auth/vk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { id_token } = await req.json();

    if (!id_token) {
      return NextResponse.json({ error: 'Missing id_token' }, { status: 400 });
    }

    // Декодируем JWT (не проверяем подпись VKID SDK)
    const payload = jwt.decode(id_token) as any;

    if (!payload) {
      return NextResponse.json({ error: 'Invalid id_token' }, { status: 401 });
    }

    // Извлекаем данные пользователя
    const email = payload.email || `${payload.sub}@vk.com`; // fallback если email нет
    const name = payload.name || `${payload.first_name || ''} ${payload.last_name || ''}`.trim();
    const vkId = payload.sub; // id пользователя VK
    const avatar = payload.picture || null;

    // Upsert пользователя в базе
    const upsertQuery = `
      INSERT INTO users (email, name, role, vk_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email)
      DO UPDATE SET name = $2, updated_at = NOW()
      RETURNING id, email, name, role, created_at, updated_at;
    `;
    const values = [email, name || `VK User ${vkId}`, 'participant', vkId];

    const result = await query(upsertQuery, values);
    const user = result.rows[0];

    return NextResponse.json({ user, avatar });
  } catch (err) {
    console.error('VK auth error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
