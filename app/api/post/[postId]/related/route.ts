import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";

type RelatedPostRouteContext = {
  params: Promise<{ postId: string }>;
};

export async function GET(
  req: NextRequest,
  context: RelatedPostRouteContext
) {
  const { postId } = await context.params;

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

    const pageSize = 12;

    const relatedPosts = await db.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      take: pageSize + 1,
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

    const hasMore = relatedPosts.length > pageSize;
    const data = hasMore ? relatedPosts.slice(0, pageSize) : relatedPosts;
    const nextCursor = hasMore ? data[data.length - 1].id : null;

    return NextResponse.json({
      ok: true,
      data,
      nextCursor,
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
