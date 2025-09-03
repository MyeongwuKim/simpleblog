import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const cursor = req.nextUrl.searchParams.get("cursor");

  try {
    const postData = await db.post.findMany({
      where: {
        isTemp: true,
      },
      select: {
        updatedAt: true,
        id: true,
        slug: true,
        preview: true,
        title: true,
      },
      take: 12,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({
      ok: true,
      data: postData,
      nextCursor: postData.length > 0 ? postData[postData.length - 1].id : null,
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
};
