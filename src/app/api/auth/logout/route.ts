import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Удаляем cookies сессии
    cookieStore.delete('session_id');
    cookieStore.delete('user_id');

    return NextResponse.json({ message: 'Успешный выход' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Ошибка при выходе' },
      { status: 500 }
    );
  }
}

