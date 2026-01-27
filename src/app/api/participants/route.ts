import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";

// GET - получить всех участников
export async function GET() {
  try {
    const [users] = await pool.execute(
      `SELECT 
        id, 
        phone_number as phone_number, 
        screen_name, 
        sity, 
        role, 
        availability, 
        defile, 
        merch, 
        avatar_url, 
        description 
      FROM users 
      ORDER BY role, screen_name`
    );
    
    return NextResponse.json({ users: Array.isArray(users) ? users : [] });
  } catch (error) {
    console.error("Get participants error:", error);
    return NextResponse.json({ message: "Ошибка получения участников" }, { status: 500 });
  }
}


// PATCH - обновить статусы участника
export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const currentUserId = cookieStore.get("userId")?.value;

    console.log("PATCH /api/participants - userId from cookie:", currentUserId);

    if (!currentUserId) {
      return NextResponse.json(
        { message: "Не авторизован" },
        { status: 401 }
      );
    }

    // Проверка прав
    const [currentUser] = await pool.execute(
      "SELECT role FROM users WHERE id = ?",
      [currentUserId]
    );

    console.log("Current user from DB:", currentUser);

    if (!Array.isArray(currentUser) || currentUser.length === 0) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 }
      );
    }

    const user = currentUser[0] as any;
    const isAdmin = user.role === "Админка" || user.role === "Контролёр";

    console.log("User role:", user.role, "isAdmin:", isAdmin);

    if (!isAdmin) {
      return NextResponse.json(
        { message: "Нет прав для изменения статусов" },
        { status: 403 }
      );
    }

    const { userId, availability, merch } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "Не указан ID пользователя" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (availability !== undefined) updateData.availability = availability;
    if (merch !== undefined) updateData.merch = merch;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "Нет данных для обновления" },
        { status: 400 }
      );
    }

    const fields = Object.keys(updateData).map((key) => `${key} = ?`);
    const values = Object.values(updateData);
    values.push(userId);

    await pool.execute(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return NextResponse.json({ message: "Статус обновлен" });
  } catch (error) {
    console.error("Update participant error:", error);
    return NextResponse.json(
      { message: "Ошибка при обновлении статуса" },
      { status: 500 }
    );
  }
}
