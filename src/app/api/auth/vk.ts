import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // или путь к вашему Prisma клиенту
import fetch from 'node-fetch';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { access_token } = body;

    if (!access_token) {
      return NextResponse.json({ error: 'Missing access_token' }, { status: 400 });
    }

    // Получаем данные пользователя из VK
    const vkRes = await fetch(
      `https://api.vk.com/method/users.get?access_token=${access_token}&v=5.131&fields=photo_100,email`
    );
    const vkData = await vkRes.json();

    if (vkData.error) {
      return NextResponse.json({ error: 'Invalid VK token' }, { status: 401 });
    }

    const vkUser = vkData.response[0];

    // Создаём или обновляем пользователя в базе
    const user = await prisma.user.upsert({
      where: { vkId: vkUser.id },
      update: {
        name: vkUser.first_name + ' ' + vkUser.last_name,
        email: vkUser.email || null,
        avatar: vkUser.photo_100 || null,
      },
      create: {
        vkId: vkUser.id,
        name: vkUser.first_name + ' ' + vkUser.last_name,
        email: vkUser.email || null,
        avatar: vkUser.photo_100 || null,
        role: 'user', // по умолчанию
      },
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error('VK auth error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
