import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

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
      'SELECT id, phone_number, screen_name, sity, role, availability, defile, merch, avatar_url, description, created_at, updated_at FROM users ORDER BY created_at DESC'
    );

    return NextResponse.json({ users: allUsers || [] });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}

// ✅ ДОБАВЬТЕ ЭТОТ МЕТОД
// POST - создать нового пользователя (только для админов)
export async function POST(request: NextRequest) {
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
    const isAdmin = user.role === 'Админка' || user.role === 'Контролёр';

    if (!isAdmin) {
      return NextResponse.json({ message: 'Доступ запрещен' }, { status: 403 });
    }

    // Получаем данные из запроса
    const { phone_number, screen_name, sity, role, password, avatar_url, defile } = await request.json();

    // Валидация обязательных полей
    if (!phone_number || !password || !role) {
      return NextResponse.json(
        { message: 'Заполните обязательные поля: номер телефона, пароль, роль' },
        { status: 400 }
      );
    }

    // Проверка существования пользователя
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE phone_number = ?',
      [phone_number]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json(
        { message: 'Пользователь с таким номером телефона уже существует' },
        { status: 400 }
      );
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const [result] = await pool.execute(
      `INSERT INTO users (
        phone_number, 
        screen_name, 
        sity, 
        role, 
        password, 
        avatar_url,
        defile,
        availability,
        merch,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, false, false, NOW(), NOW())`,
      [
        phone_number,
        screen_name || '',
        sity || '',
        role,
        hashedPassword,
        avatar_url || null,
        defile || false
      ]
    );

    const insertResult = result as any;

    // Получаем созданного пользователя
    const [newUser] = await pool.execute(
      `SELECT 
        id, 
        phone_number, 
        screen_name, 
        sity, 
        role, 
        availability, 
        defile, 
        merch, 
        avatar_url, 
        description,
        created_at, 
        updated_at 
      FROM users 
      WHERE id = ?`,
      [insertResult.insertId]
    );

    return NextResponse.json(
      {
        message: 'Пользователь успешно создан',
        user: Array.isArray(newUser) ? newUser[0] : null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { message: 'Ошибка при создании пользователя', error: String(error) },
      { status: 500 }
    );
  }
}
