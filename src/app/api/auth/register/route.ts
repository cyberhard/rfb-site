import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { phone_number, password, screen_name, sity } = await request.json();

    if (!phone_number || !password || !screen_name || !sity) {
      return NextResponse.json({ message: 'Заполните все поля' }, { status: 400 });
    }

    // Проверка существования
    const [existing] = await pool.execute('SELECT id FROM users WHERE phone_number = ?', [phone_number]);
    if ((existing as any[]).length > 0) {
      return NextResponse.json({ message: 'Пользователь уже существует' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      'INSERT INTO users (phone_number, password, screen_name, sity, role, availability, defile, merch) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [phone_number, hashedPassword, screen_name, sity, 'Участник', false, false, false]
    );

    return NextResponse.json({ message: 'Регистрация успешна' }, { status: 201 });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}
