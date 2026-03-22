import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (request.method !== "POST" && request.method !== "DELETE") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.SECRET });

  if (
    !token &&
    !(request.method === "POST" && pathname.startsWith("/api/comments")) &&
    !(
      request.method === "POST" &&
      pathname.startsWith("/api/post/") &&
      pathname.endsWith("/view")
    )
  ) {
    return NextResponse.json(
      { error: "API 접근 권한이 없습니다." },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
