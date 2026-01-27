import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/db';

// GET - получить всех пользователей (только для админов)
export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
    }

    // Проверка прав администратора
    const [users] = await pool.execute(
      'SELECT role FROM users WHERE id = ?',
      [userId]
    );

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
    }

    const user = users[0] as any;
    const isAdmin = user.role === 'Админка' || user.role === 'Организатор' || user.role === 'Контролёр';

    if (!isAdmin) {
      return NextResponse.json({ message: 'Доступ запрещен' }, { status: 403 });
    }

    const [allUsers] = await pool.execute(
      'SELECT id, phone_number, screen_name, sity, role, availability, defile, merch, created_at, updated_at FROM users ORDER BY created_at DESC'
    );

    return NextResponse.json({ users: allUsers || [] });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}

