import { db } from "@/app/lib/db";

import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const page = req.nextUrl.searchParams.get("page");
    let tagData = await db.tag.findMany({
      select: {
        id: true,
        body: true,
        _count: {
          select: { posts: true },
        },
      },
    });

    // 전체 글 수 합계
    const totalCount = await db.post.count({
      where: {
        isTemp: false,
      },
    });

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

export const DELETE = async (req: NextRequest) => {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "삭제할 태그 id가 필요합니다." },
        { status: 400 }
      );
    }

    const posts = await db.post.findMany({
      where: { tagIds: { has: id } }, // 배열 안에 id 포함 여부
      select: { id: true, tagIds: true },
    });
    let updatedPosts = [];
    for (const post of posts) {
      let updated = await db.post.update({
        where: { id: post.id },
        data: {
          tagIds: post.tagIds.filter((tagId) => tagId !== id),
        },
      });
      updatedPosts.push(updated);
    }

    const tagData = await db.tag.delete({
      where: { id },
    });

    return NextResponse.json({
      ok: true,
      data: {
        tag: tagData,
        post: updatedPosts,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
};
