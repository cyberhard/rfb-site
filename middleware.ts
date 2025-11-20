export function middleware(req: any) {
  const pathname = req.nextUrl.pathname;

  // Разрешить авторизационные маршруты без токена
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  return NextResponse.next();
}
