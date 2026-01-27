// api/tickets/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface Ticket extends RowDataPacket { // ← Extends RowDataPacket  id: number;
  type: string;
  price: number;
  created_at: Date | string;
}
async function checkAdmin() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    return { ok: false as const, status: 401, message: 'Не авторизован' };
  }

  const [users] = await pool.execute(
    'SELECT role FROM users WHERE id = ?',
    [userId]
  );

  if (!Array.isArray(users) || users.length === 0) {
    return { ok: false as const, status: 404, message: 'Пользователь не найден' };
  }

  const user = users[0] as { role: string };
  const isAdmin = user.role === 'Админка' || user.role === 'Организатор';

  if (!isAdmin) {
    return { ok: false as const, status: 403, message: 'Доступ запрещен' };
  }

  return { ok: true as const };
}

// PUT /api/tickets/[id]
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // ← Изменено
) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.ok) {
      return NextResponse.json(
        { message: adminCheck.message },
        { status: adminCheck.status }
      );
    }

    const { id } = await context.params; // ← await добавлен
    const { type, price } = await request.json();

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (type !== undefined) {
      updateFields.push('type = ?');
      updateValues.push(type);
    }
    if (price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(price);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { message: 'Нет данных для обновления' },
        { status: 400 }
      );
    }

    updateValues.push(id);

    const [existing] = await pool.execute(
      'SELECT id FROM tikets WHERE id = ?',
      [id]
    );
    if (!Array.isArray(existing) || existing.length === 0) {
      return NextResponse.json(
        { message: 'Тип билета не найден' },
        { status: 404 }
      );
    }

    await pool.execute(
      `UPDATE tikets SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    const [updated] = await pool.execute<Ticket[]>(
      'SELECT id, type, price, created_at FROM tikets WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      message: 'Тип билета обновлен',
      ticket: updated[0] ?? null,
    });
  } catch (error) {
    console.error('Update ticket error:', error);
    return NextResponse.json(
      { message: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

// DELETE /api/tickets/[id]
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // ← Изменено
) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.ok) {
      return NextResponse.json(
        { message: adminCheck.message },
        { status: adminCheck.status }
      );
    }

    const { id } = await context.params; // ← await добавлен

    const [existing] = await pool.execute(
      'SELECT id FROM tikets WHERE id = ?',
      [id]
    );
    
    if (!Array.isArray(existing) || existing.length === 0) {
      return NextResponse.json(
        { message: 'Тип билета не найден' },
        { status: 404 }
      );
    }

    await pool.execute('DELETE FROM tikets WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Тип билета удален' });
  } catch (error) {
    console.error('Delete ticket error:', error);
    return NextResponse.json(
      { message: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
