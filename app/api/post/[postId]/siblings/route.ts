import { db } from "@/app/lib/db";
import { Tag } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { ObjectId } from "mongodb";

export const GET = async (
  req: NextRequest,
  { params }: { params: { postId: string } }
) => {
  const { postId } = await params;
  const type = req.nextUrl.searchParams.get("type");

  if (!ObjectId.isValid(postId)) {
    return NextResponse.json({ ok: false, data: null });
  }

  try {
    const postData = await db.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        createdAt: true,
      },
    });
    if (!postData) {
      return NextResponse.json(
        { ok: false, data: null, error: "존재하지 않는 글입니다" },
        { status: 200 }
      );
    }
    // 이전 글 (더 오래된 글)
    const prevPost = await db.post.findFirst({
      where: {
        NOT: {
          isTemp: true,
        },
        createdAt: { lt: postData?.createdAt }, // 현재 글보다 이전
      },
      orderBy: { createdAt: "desc" }, // 가장 가까운 이전 글
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    // 다음 글 (더 최신 글)
    const nextPost = await db.post.findFirst({
      where: {
        NOT: {
          isTemp: true,
        },
        createdAt: { gt: postData?.createdAt }, // 현재 글보다 이후
      },
      orderBy: { createdAt: "asc" }, // 가장 가까운 다음 글
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    return NextResponse.json({
      ok: true,
      data: {
        prev: prevPost,
        next: nextPost,
      },
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
