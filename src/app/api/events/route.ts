import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/db';

// GET - получить все события
// GET запрос должен выглядеть так:
export async function GET() {
  try {
    const [events] = await pool.execute(
      // Возвращаем время как строку, БЕЗ преобразований
      `SELECT 
        id, 
        title, 
        DATE_FORMAT(time, '%Y-%m-%d %H:%i:%s') AS startTime,
        status 
      FROM events 
      ORDER BY time ASC`
    );
    
    const eventsArray = Array.isArray(events) ? events : [];
    
    return NextResponse.json({ events: eventsArray });
  } catch (error) {
    console.error("Get events error:", error);
    return NextResponse.json({ message: "Ошибка загрузки событий" }, { status: 500 });
  }
}



// POST - создать событие (только для админов)
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
    }

    const [users] = await pool.execute(
      'SELECT role FROM users WHERE id = ?',
      [userId]
    );

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
    }

    const user = users[0] as { role: string };
    
    if (user.role !== 'Админка') {
      return NextResponse.json({ message: 'Доступ запрещен' }, { status: 403 });
    }

    const { title, startTime, status } = await request.json();

    if (!title || !startTime || !status) {
      return NextResponse.json({ message: 'Заполните все поля' }, { status: 400 });
    }

    // startTime уже приходит в формате "2026-07-30 12:12:00" от фронта
    const [result] = await pool.execute(
      'INSERT INTO events (title, time, status) VALUES (?, ?, ?)',
      [title, startTime, status]
    );

    const insertResult = result as any;
    
    const [newEvent] = await pool.execute(
      'SELECT id, title, time AS startTime, status FROM events WHERE id = ?',
      [insertResult.insertId]
    );

    return NextResponse.json({
      message: 'Событие создано',
      event: Array.isArray(newEvent) ? newEvent[0] : null,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { message: 'Ошибка сервера', error: String(error) },
      { status: 500 }
    );
  }
}
