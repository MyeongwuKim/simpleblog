import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: { postId: string } }
) {
  const { postId } = (await context.params) as { postId: string };

  const page = req.nextUrl.searchParams.get("page");
  const pageNumber = page ? parseInt(page, 10) : 0;
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

    const totalCount = await db.post.count({ where });
    const relatedPosts = await db.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 12,
      skip: pageNumber * 12,
      select: {
        id: true,
        slug: true,
        preview: true,
        title: true,
        createdAt: true,
        thumbnail: true,
      },
    });

    return NextResponse.json({ ok: true, data: relatedPosts, totalCount });
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
