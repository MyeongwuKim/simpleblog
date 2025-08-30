import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, origin, href } = request.nextUrl;
  const token = await getToken({ req: request, secret: process.env.SECRET });

  // 로그인 필요 페이지들
  const protectedPages = ["/write", "/setting", "/temp"];

  // 1) 페이지 접근 차단
  if (protectedPages.some((page) => pathname.startsWith(page)) && !token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (
    !token &&
    (request.method === "POST" || request.method === "DELETE") &&
    !pathname.startsWith("/api/auth") &&
    !(request.method === "POST" && pathname.startsWith("/api/comments")) // 댓글 POST만 예외
  ) {
    return NextResponse.json(
      { error: "API 접근 권한이 없습니다." },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*", // API 요청도 검사
    "/((?!_next/static|_next/image|favicon.ico|auth/signin).*)", // 나머지 페이지
  ],
};
