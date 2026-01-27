// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  //РАЗРЕШИТЬ ПУБЛИЧНЫЙ ДОСТУП К АВАТАРКАМ - ПЕРВЫМ ДЕЛОМ!
  if (path.startsWith("/api/avatars")) {
    return NextResponse.next();
  }

  //РАЗРЕШИТЬ ПУБЛИЧНЫЙ ДОСТУП К /api/auth/me
  if (path === "/api/auth/me" && request.method === "GET") {
    return NextResponse.next();
  }

  //АЗРЕШИТЬ ПУБЛИЧНЫЙ ДОСТУП К СПИСКУ УЧАСТНИКОВ
  if (path === "/api/participants" && request.method === "GET") {
    return NextResponse.next();
  }

  // Блокировать подозрительные запросы к .php файлам
  if (
    path.endsWith(".php") ||
    path.includes("wp-admin") ||
    path.includes("wp-content") ||
    path.includes("wp-includes") ||
    path.includes(".well-known/acme-challenge") ||
    path.includes("cgi-bin")
  ) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
