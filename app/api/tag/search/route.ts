import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json([]); // 2글자 미만이면 결과 X
  }
  try {
    const qLower = q.toLowerCase();
    const tags = await db.tag.findMany({
      where: {
        body: {
          startsWith: qLower,
        },
      },
      select: {
        body: true,
      },
    });
    return NextResponse.json({
      ok: true,
      data: tags,
    });
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json(
        { ok: false, error: e.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { ok: false, error: "Unknown error" },
      { status: 500 }
    );
  }
}
