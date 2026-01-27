import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import { deleteAvatarFile } from "@/lib/deleteFile";

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
      return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
    }

    // Проверка прав доступа
    const [currentUser] = await pool.execute(
      "SELECT role FROM users WHERE id = ?",
      [currentUserId]
    );

    if (!Array.isArray(currentUser) || currentUser.length === 0) {
      return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
    }

    const user = currentUser[0] as any;
    const isAdmin = user.role === "Админка";

    // Только админ или сам пользователь могут редактировать
    if (!isAdmin && currentUserId !== id) {
      return NextResponse.json({ message: "Нет доступа" }, { status: 403 });
    }

    // Получаем существующего пользователя (нужен старый avatar_url)
    const [existing] = await pool.execute(
      "SELECT id, role, avatar_url FROM users WHERE id = ?",
      [id]
    );

    if (!Array.isArray(existing) || existing.length === 0) {
      return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
    }

    const existingUser = existing[0] as any;
    const { screen_name, sity, role, avatar_url, description } = await request.json();

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (screen_name !== undefined) {
      updateFields.push("screen_name = ?");
      updateValues.push(screen_name);
    }

    if (sity !== undefined) {
      updateFields.push("sity = ?");
      updateValues.push(sity);
    }

    // ✅ НОВОЕ: Удаляем старый аватар при смене
    if (avatar_url !== undefined && avatar_url !== existingUser.avatar_url) {
      // Удаляем старый файл
      if (existingUser.avatar_url) {
        await deleteAvatarFile(existingUser.avatar_url);
      }
      
      updateFields.push("avatar_url = ?");
      updateValues.push(avatar_url);
    }

    // Только админ может менять роль
    if (isAdmin && role !== undefined) {
      updateFields.push("role = ?");
      updateValues.push(role);
    }

    // Описание только для организаторов/спонсоров
    if (description !== undefined) {
      const targetRole = isAdmin && role !== undefined ? role : existingUser.role;
      if (targetRole === "Организатор" || targetRole === "Спонсор") {
        updateFields.push("description = ?");
        updateValues.push(description);
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ message: "Нет данных для обновления" }, { status: 400 });
    }

    updateFields.push("updated_at = NOW()");
    updateValues.push(id);

    await pool.execute(
      `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues
    );

    // Получаем обновленные данные
    const [updated] = await pool.execute(
      `SELECT id, phone_number, screen_name, sity, role, availability, defile, merch, avatar_url, description, created_at, updated_at FROM users WHERE id = ?`,
      [id]
    );

    return NextResponse.json({
      message: "Профиль обновлен",
      user: Array.isArray(updated) ? updated[0] : null,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}

// ✅ НОВОЕ: Удаляем аватар при удалении пользователя
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
      return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
    }

    // Проверка прав администратора
    const [currentUser] = await pool.execute(
      "SELECT role FROM users WHERE id = ?",
      [currentUserId]
    );

    if (!Array.isArray(currentUser) || currentUser.length === 0) {
      return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
    }

    const user = currentUser[0] as any;
    const isAdmin = user.role === "Админка";

    if (!isAdmin) {
      return NextResponse.json({ message: "Нет доступа" }, { status: 403 });
    }

    // ✅ НОВОЕ: Получаем avatar_url перед удалением
    const [existing] = await pool.execute(
      "SELECT id, avatar_url FROM users WHERE id = ?",
      [id]
    );

    if (!Array.isArray(existing) || existing.length === 0) {
      return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
    }

    const existingUser = existing[0] as any;

    // ✅ НОВОЕ: Удаляем аватар с диска
    if (existingUser.avatar_url) {
      await deleteAvatarFile(existingUser.avatar_url);
    }

    // Удаление пользователя из БД
    await pool.execute("DELETE FROM users WHERE id = ?", [id]);

    return NextResponse.json({ message: "Пользователь удален" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
