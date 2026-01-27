import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";

// PUT - обновить пользователя
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;
    
    const cookieStore = await cookies();
    const currentUserId = cookieStore.get("userId")?.value;

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

    if (!Array.isArray(currentUser) || currentUser.length === 0) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 }
      );
    }

    const user = currentUser[0] as any;
    const isAdmin = user.role === "Админка" || user.role === "Контролёр";

    // Админ может редактировать всех, пользователь - только себя
    if (!isAdmin && currentUserId !== id) {
      return NextResponse.json(
        { message: "Нет прав для редактирования этого профиля" },
        { status: 403 }
      );
    }

    // Проверка существования пользователя
    const [existing] = await pool.execute(
      "SELECT id, role FROM users WHERE id = ?",
      [id]
    );

    if (!Array.isArray(existing) || existing.length === 0) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 }
      );
    }

    const existingUser = existing[0] as any;

    // Получение данных для обновления
    const { screen_name, sity, role, avatar_url, description } =
      await request.json();

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    // Базовые поля (доступны всем)
    if (screen_name !== undefined) {
      updateFields.push("screen_name = ?");
      updateValues.push(screen_name);
    }

    if (sity !== undefined) {
      updateFields.push("sity = ?");
      updateValues.push(sity);
    }

    if (avatar_url !== undefined) {
      updateFields.push("avatar_url = ?");
      updateValues.push(avatar_url);
    }

    // Роль может менять только админ
    if (isAdmin && role !== undefined) {
      updateFields.push("role = ?");
      updateValues.push(role);
    }

    // Описание для организаторов/спонсоров
    if (description !== undefined) {
      const targetRole = isAdmin && role !== undefined ? role : existingUser.role;
      if (targetRole === "Организатор" || targetRole === "Спонсор") {
        updateFields.push("description = ?");
        updateValues.push(description);
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { message: "Нет данных для обновления" },
        { status: 400 }
      );
    }

    // Добавляем updated_at
    updateFields.push("updated_at = NOW()");
    updateValues.push(id);

    // Обновление пользователя
    await pool.execute(
      `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues
    );

    // Получение обновленных данных
    const [updated] = await pool.execute(
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
      [id]
    );

    return NextResponse.json({
      message: "Профиль обновлен",
      user: Array.isArray(updated) ? updated[0] : null,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { message: "Ошибка при обновлении профиля" },
      { status: 500 }
    );
  }
}

// DELETE - удалить пользователя (только админ)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;
    
    const cookieStore = await cookies();
    const currentUserId = cookieStore.get("userId")?.value;

    if (!currentUserId) {
      return NextResponse.json(
        { message: "Не авторизован" },
        { status: 401 }
      );
    }

    // Только админ может удалять
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

    if (!isAdmin) {
      return NextResponse.json(
        { message: "Нет прав для удаления пользователей" },
        { status: 403 }
      );
    }

    // Проверка существования
    const [existing] = await pool.execute(
      "SELECT id FROM users WHERE id = ?",
      [id]
    );

    if (!Array.isArray(existing) || existing.length === 0) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 }
      );
    }

    // Удаление
    await pool.execute("DELETE FROM users WHERE id = ?", [id]);

    return NextResponse.json({ message: "Пользователь удален" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { message: "Ошибка при удалении пользователя" },
      { status: 500 }
    );
  }
}
