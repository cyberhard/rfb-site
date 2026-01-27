import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  // ❌ НЕ ПРОВЕРЯЕМ АВТОРИЗАЦИЮ ЗДЕСЬ!
  // const cookieStore = await cookies();
  // const userId = cookieStore.get("userId")?.value;
  
  const { slug } = await params;
  const filename = slug.join("/");
  
  const uploadDir = path.join(process.cwd(), "uploads", "avatars");
  const filepath = path.join(uploadDir, filename);

  if (!fs.existsSync(filepath)) {
    return new NextResponse("File not found", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filepath);
  const ext = filename.split(".").pop()?.toLowerCase();
  
  const contentTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
  };

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentTypes[ext || "jpg"] || "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
