import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { phone_number, password } = await request.json();

    if (!phone_number || !password) {
      return NextResponse.json(
        { message: "Заполните все поля" },
        { status: 400 }
      );
    }

    // Поиск пользователя
    const [users] = await pool.execute(
      "SELECT * FROM users WHERE phone_number = ?",
      [phone_number]
    );

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { message: "Неверный телефон или пароль" },
        { status: 401 }
      );
    }

    const user = users[0] as any;

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Неверный телефон или пароль" },
        { status: 401 }
      );
    }

    // Установка куки
    const cookieStore = await cookies();
    cookieStore.set("userId", String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: "/",
    });

    console.log("Login successful, userId set:", user.id); // DEBUG

    return NextResponse.json({
      message: "Успешный вход",
      user: {
        id: user.id,
        phone_number: user.phone_number,
        screen_name: user.screen_name,
        sity: user.sity,
        role: user.role,
        avatar_url: user.avatar_url,
        description: user.description,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
