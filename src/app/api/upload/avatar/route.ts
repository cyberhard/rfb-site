import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, access } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { constants } from "fs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json({ message: "Файл не найден" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Допустимые форматы: JPG, PNG, WEBP" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Размер файла не должен превышать 5MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop();
    const filename = `${uuidv4()}.${ext}`;

    const uploadDir = path.join(process.cwd(), "uploads", "avatars");

    try {
      await access(uploadDir, constants.W_OK);
    } catch {
      await mkdir(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const avatarUrl = `/api/avatars/${filename}`;  // вместо /avatars/${filename}

    return NextResponse.json({
      message: "Аватар загружен",
      avatarUrl,
    });
  } catch (error) {
    console.error("Upload avatar error:", error);
    return NextResponse.json(
      { message: "Ошибка сервера", error: String(error) },
      { status: 500 }
    );
  }
}
