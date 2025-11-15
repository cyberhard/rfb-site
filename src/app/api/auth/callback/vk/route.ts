import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { access_token, user_id, email, name } = await req.json();

  if (!user_id || !name) {
    return NextResponse.json({ error: 'Invalid VK data' }, { status: 400 });
  }

  try {
    // Проверяем есть ли пользователь
    const result = await query('SELECT * FROM users WHERE id = $1', [user_id]);

    if (result.rowCount === 0) {
      // Добавляем нового пользователя
      await query(
        'INSERT INTO users (id, email, password, name, role) VALUES ($1, $2, $3, $4, $5)',
        [
          user_id,
          email || `${user_id}@vk.fake`, // если email нет
          'vk_auth', // пароль не нужен, но колонка not null
          name,
          'participant',
        ]
      );
    }

    return NextResponse.json({ success: true, user: { id: user_id, name, email, role: 'participant' } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
