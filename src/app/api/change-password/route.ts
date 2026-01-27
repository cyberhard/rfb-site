import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const currentUserId = cookieStore.get("userId")?.value; // ← БЫЛО user_id, СТАЛО userId

    if (!currentUserId) {
      return NextResponse.json(
        { message: "Не авторизован" },
        { status: 401 }
      );
    }

    const { userId, newPassword } = await request.json();

    if (!userId || !newPassword) {
      return NextResponse.json(
        { message: "Не указан ID пользователя или новый пароль" },
        { status: 400 }
      );
    }

    // Проверка прав: админ может менять любой пароль, пользователь - только свой
    const [currentUser] = await pool.execute(
      "SELECT role FROM users WHERE id = ?",
      [currentUserId]
    );

    if (!Array.isArray(currentUser) || currentUser.length === 0) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 }
      );
    }

    const user = currentUser[0] as any;
    const isAdmin = user.role === "Админка" || user.role === "Контролёр";

    if (!isAdmin && currentUserId !== String(userId)) {
      return NextResponse.json(
        { message: "Нет прав для изменения этого пароля" },
        { status: 403 }
      );
    }

    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Обновляем пароль
    await pool.execute("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      userId,
    ]);

    return NextResponse.json({ message: "Пароль успешно изменен" });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { message: "Ошибка при смене пароля" },
      { status: 500 }
    );
  }
}
