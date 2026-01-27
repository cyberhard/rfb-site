// app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/db';


// PUT - обновить событие
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;  // Добавлен await
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

    const user = users[0] as any;
    const isAdmin = user.role === 'Админка';

    if (!isAdmin) {
      return NextResponse.json({ message: 'Доступ запрещен' }, { status: 403 });
    }

    const { title, startTime, status } = await request.json();

    const [existing] = await pool.execute(
      'SELECT id FROM events WHERE id = ?',
      [id]
    );

    if (!Array.isArray(existing) || existing.length === 0) {
      return NextResponse.json({ message: 'Событие не найдено' }, { status: 404 });
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (startTime !== undefined) {
      updateFields.push('time = ?');
      updateValues.push(startTime);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ message: 'Нет данных для обновления' }, { status: 400 });
    }

    updateValues.push(id);

    await pool.execute(
      `UPDATE events SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    const [updated] = await pool.execute(
      'SELECT id, title AS title, time AS startTime, status FROM events WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      message: 'Событие обновлено',
      event: Array.isArray(updated) ? updated[0] : null,
    });
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}


// DELETE - удалить событие
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;  // Добавлен await
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

    const user = users[0] as any;
    const isAdmin = user.role === 'Админка';

    if (!isAdmin) {
      return NextResponse.json({ message: 'Доступ запрещен' }, { status: 403 });
    }

    const [existing] = await pool.execute(
      'SELECT id FROM events WHERE id = ?',
      [id]
    );

    if (!Array.isArray(existing) || existing.length === 0) {
      return NextResponse.json({ message: 'Событие не найдено' }, { status: 404 });
    }

    await pool.execute('DELETE FROM events WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Событие удалено' });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}
