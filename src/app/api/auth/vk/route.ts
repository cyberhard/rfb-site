// app/api/auth/vk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { code, deviceId } = await req.json();
    if (!code || !deviceId) {
      return NextResponse.json({ error: 'Missing code or deviceId' }, { status: 400 });
    }

    // 1. Обмениваем код на VK API access_token через VKID SDK
    const tokenRes = await fetch('https://api.vk.com/v2.0/authorize/code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.VK_CLIENT_ID,
        client_secret: process.env.VK_CLIENT_SECRET,
        code,
        device_id: deviceId,
        redirect_uri: process.env.VK_REDIRECT_URI
      })
    });
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return NextResponse.json({ error: 'Invalid VKID code' }, { status: 401 });
    }

    const accessToken = tokenData.access_token;

    // 2. Получаем профиль пользователя через VK API
    const profileRes = await fetch(`https://api.vk.com/method/account.getProfileInfo?access_token=${accessToken}&v=5.131`);
    const profileData = await profileRes.json();

    if (!profileData.response) {
      return NextResponse.json({ error: 'Invalid VK response' }, { status: 500 });
    }

    const vkUser = profileData.response;
    const vkId = vkUser.id;
    const name = `${vkUser.first_name || ''} ${vkUser.last_name || ''}`.trim();
    const avatar = vkUser.photo_200 || null;

    // 3. Добавляем в user_tags, если нет
    await query(
      'INSERT INTO user_tags(user_id) VALUES($1) ON CONFLICT DO NOTHING',
      [vkId]
    );

    // 4. Добавляем или обновляем пользователя в users
    const userResult = await query(
      `INSERT INTO users(name, vk_id)
       VALUES ($1, $2)
       ON CONFLICT (vk_id) DO UPDATE SET name = $1, updated_at = NOW()
       RETURNING id, name, vk_id`,
      [name, vkId]
    );

    return NextResponse.json({ user: userResult.rows[0], avatar });

  } catch (err) {
    console.error('VK auth error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
