import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { phone_number, password, screen_name, sity } = await req.json();

    // Валидация
    if (!phone_number || !password || !screen_name || !sity) {
      return NextResponse.json(
        { error: 'Все поля обязательны для заполнения' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Пароль должен содержать минимум 6 символов' },
        { status: 400 }
      );
    }

    // Проверка, существует ли пользователь с таким номером
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE phone_number = ?',
      [phone_number]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Пользователь с таким номером телефона уже существует' },
        { status: 409 }
      );
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const [result] = await db.execute(
      `INSERT INTO users (phone_number, password, screen_name, sity, role, availability, defile, merch) 
       VALUES (?, ?, ?, ?, 'Участник', FALSE, FALSE, FALSE)`,
      [phone_number, hashedPassword, screen_name, sity]
    );

    const insertResult = result as any;

    // Получение созданного пользователя (без пароля)
    const [users] = await db.execute(
      'SELECT id, phone_number, screen_name, sity, role, availability, defile, merch FROM users WHERE id = ?',
      [insertResult.insertId]
    );

    const user = Array.isArray(users) ? users[0] : null;

    return NextResponse.json(
      { message: 'Пользователь успешно зарегистрирован', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Ошибка при регистрации' },
      { status: 500 }
    );
  }
}

