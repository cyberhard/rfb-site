import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value; // ← Правильное название

    console.log("GET /api/auth/me - userId from cookie:", userId);

    if (!userId) {
      return NextResponse.json(
        { message: "Не авторизован" },
        { status: 401 }
      );
    }

    const [users] = await pool.execute(
      `SELECT 
        id, 
        phone_number, 
        screen_name, 
        sity, 
        role, 
        avatar_url, 
        description,
        availability,
        defile,
        merch
      FROM users 
      WHERE id = ?`,
      [userId]
    );

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: users[0] });
  } catch (error) {
    console.error("Get me error:", error);
    return NextResponse.json(
      { message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
