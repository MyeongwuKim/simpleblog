import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: { postId: string } }
) {
  const { postId } = (await context.params) as { postId: string };

  const cursor = req.nextUrl.searchParams.get("cursor");
  const tags = req.nextUrl.searchParams.getAll("tags");

  try {
    if (!postId) {
      return NextResponse.json(
        { ok: false, error: "postId 누락" },
        { status: 400 }
      );
    }

    const where =
      tags.length > 0
        ? {
            id: { not: postId },
            isTemp: false,
            tag: { some: { body: { in: tags } } },
          }
        : {
            id: { not: postId },
            isTemp: false,
          };

    const relatedPosts = await db.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}), // ✅ 수정
      take: 12,
      select: {
        id: true,
        slug: true,
        preview: true,
        title: true,
        createdAt: true,
        thumbnail: true,
        images: true,
      },
    });

    return NextResponse.json({
      ok: true,
      data: relatedPosts,
      nextCursor:
        relatedPosts.length > 0
          ? relatedPosts[relatedPosts.length - 1].id
          : null,
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
