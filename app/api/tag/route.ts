import { unstable_cache } from "next/cache";
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/app/lib/db";

const getTagsWithCount = unstable_cache(
  async () => {
    const tagData = await db.tag.findMany({
      where: { isTemp: false },
      select: {
        id: true,
        body: true,
        _count: { select: { posts: true } },
      },
    });

    const totalCount = await db.post.count({
      where: { isTemp: false },
    });

    const allTag = {
      body: "전체",
      _count: { posts: totalCount },
    };

    return [allTag, ...tagData];
  },
  ["tags-with-count"], // 캐시 키
  {
    revalidate: 60, // 1분마다 자동 갱신 (원하면 0으로 해서 강제 무효화 전용으로도 가능)
    tags: ["tag", "posts"], // 두 가지 태그에 모두 반응
  }
);

export const GET = async () => {
  try {
    const result = await getTagsWithCount();
    return NextResponse.json({ ok: true, data: result });
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

export const DELETE = async (req: NextRequest) => {
  try {
    const id = req.nextUrl.searchParams.get("id");

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
    const updatedPosts = [];
    for (const post of posts) {
      const updated = await db.post.update({
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
