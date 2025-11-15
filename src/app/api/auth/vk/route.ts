// app/api/auth/vk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { access_token } = await req.json();

    if (!access_token) {
      return NextResponse.json({ error: 'Missing access_token' }, { status: 400 });
    }

    // 1. Получаем данные пользователя с VK
    const vkRes = await fetch(`https://api.vk.com/method/account.getProfileInfo?access_token=${access_token}&v=5.131`);
    const vkData = await vkRes.json();

    if (!vkData.response) {
      return NextResponse.json({ error: 'Invalid VK response' }, { status: 401 });
    }

    const vkUser = vkData.response;
    const vkId = vkUser.id;
    const name = `${vkUser.first_name || ''} ${vkUser.last_name || ''}`.trim();
    const avatar = vkUser.photo_200 || null;

    // 2. Проверяем, есть ли пользователь в user_tags
    const checkTagQuery = 'SELECT * FROM user_tags WHERE user_id = $1';
    const tagResult = await query(checkTagQuery, [vkId]);

    if (tagResult.rows.length === 0) {
      // Добавляем нового пользователя в user_tags
      const insertTagQuery = 'INSERT INTO user_tags (user_id) VALUES ($1) RETURNING *';
      await query(insertTagQuery, [vkId]);
    }

    // 3. Добавляем или обновляем пользователя в users (по id из users)
    //    Предполагаем, что связь users <-> user_tags через primary key id
    //    Здесь можно искать существующего пользователя по user_id в user_tags
    const upsertUserQuery = `
      INSERT INTO users (name, vk_id)
      VALUES ($1, $2)
      ON CONFLICT (vk_id)
      DO UPDATE SET name = $1, updated_at = NOW()
      RETURNING id, name, vk_id, created_at, updated_at;
    `;
    const userResult = await query(upsertUserQuery, [name, vkId]);
    const user = userResult.rows[0];

    return NextResponse.json({ user, avatar });
  } catch (err) {
    console.error('VK auth error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
