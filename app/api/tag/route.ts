import { db } from "@/app/lib/db";

import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const page = req.nextUrl.searchParams.get("page");
    let tagData = await db.tag.findMany({
      select: {
        body: true,
        _count: {
          select: { posts: true },
        },
      },
    });

    // 전체 글 수 합계
    const totalCount = tagData.reduce((sum, tag) => sum + tag._count.posts, 0);

    const allTag = {
      body: "전체",
      _count: { posts: totalCount },
    };

    const result = [allTag, ...tagData];
    return NextResponse.json({
      ok: true,
      data: result,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  } finally {
  }
};
