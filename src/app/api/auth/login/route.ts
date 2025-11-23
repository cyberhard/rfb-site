import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import db from '@/lib/db';

// GET - проверка текущей сессии
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;

    if (!sessionId) {
      return NextResponse.json({ user: null });
    }

    // Здесь можно добавить проверку сессии в Redis или БД
    // Пока просто возвращаем null, так как сессии хранятся в cookies
    // Для полноценной работы нужно добавить таблицу sessions
    
    return NextResponse.json({ user: null });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ user: null });
  }
}

// POST - вход по логину и паролю
export async function POST(req: NextRequest) {
  try {
    const { phone_number, password } = await req.json();

    if (!phone_number || !password) {
      return NextResponse.json(
        { error: 'Номер телефона и пароль обязательны' },
        { status: 400 }
      );
    }

    // Поиск пользователя по номеру телефона
    const [users] = await db.execute(
      'SELECT id, phone_number, password, screen_name, sity, role, availability, defile, merch FROM users WHERE phone_number = ?',
      [phone_number]
    );

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { error: 'Неверный номер телефона или пароль' },
        { status: 401 }
      );
    }

    const user = users[0] as any;

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Неверный номер телефона или пароль' },
        { status: 401 }
      );
    }

    // Удаляем пароль из объекта пользователя
    const { password: _, ...userWithoutPassword } = user;

    // Создаем сессию (простая реализация через cookie)
    const sessionId = `${user.id}-${Date.now()}-${Math.random().toString(36)}`;
    const cookieStore = await cookies();
    cookieStore.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    });

    // Сохраняем ID пользователя в cookie для быстрого доступа
    cookieStore.set('user_id', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      message: 'Успешный вход',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Ошибка при входе' },
      { status: 500 }
    );
  }
}

