import { unlink } from "fs/promises";
import path from "path";

export async function deleteAvatarFile(avatarUrl: string | null | undefined): Promise<boolean> {
  if (!avatarUrl) return false;

  try {
    // Извлекаем имя файла из URL (например, "/avatars/uuid.jpg" -> "uuid.jpg")
    const filename = avatarUrl.split("/").pop();
    if (!filename) return false;

    // Полный путь к файлу
    const filepath = path.join(process.cwd(), "public", "avatars", filename);

    // Удаляем файл
    await unlink(filepath);
    console.log(`✅ Deleted avatar file: ${filepath}`);
    return true;
  } catch (error) {
    console.error("❌ Error deleting avatar file:", error);
    return false;
  }
}
