import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, unstable_cache } from "next/cache";
import { Image } from "@prisma/client";

// 1) 공통 RAW 쿼리 (id 기준으로 단순·안전 페이징)
async function getPostsPageRaw(args: {
  cursor?: string;
  tag?: string;
  datetype?: "week" | "month" | "year" | "all";
  type?: string;
}) {
  const { cursor, tag, datetype } = args;

  // 날짜 필터
  let dateCondition = {};
  if (datetype === "week") dateCondition = { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
  if (datetype === "month") dateCondition = { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
  if (datetype === "year") dateCondition = { gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) };

  const take = 12;

  const data = await db.post.findMany({
    where: {
      ...(tag !== "all" ? { tag: { some: { body: tag } } } : {}),
      ...(datetype && datetype !== "all" ? { createdAt: dateCondition } : {}),
    },
    // ✅ 페이징은 정렬 필드와 커서 필드가 같아야 안정적 → id 기준으로 통일
    orderBy: { createdAt: "desc" },
    take,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      createdAt: true,
      thumbnail: true,
      id: true,
      slug: true,
      preview: true,
      title: true,
      images: true,
    },
  });

  const nextCursor = data.length === take ? data[data.length - 1].id : null;

  return { ok: true as const, data, nextCursor };
}

async function createUniqueSlug(base: string) {
  let slug = "";
  let isUnique = false;

  while (!isUnique) {
    const random = Math.random().toString(36).substring(2, 9); // 7자리 랜덤
    slug = `${base}-${random}`;
    const existing = await db.post.findUnique({ where: { slug } });
    if (!existing) isUnique = true;
  }

  return slug;
}

// 2) 캐시 팩토리 함수
function getPostsPageCached(tag: string, datetype: "week" | "month" | "year" | "all") {
  return unstable_cache(
    async () => {
      return getPostsPageRaw({ tag, datetype, cursor: undefined });
    },
    ["posts:v1", tag, datetype], // ✅ 고정 배열, 조합별로 분리
    { revalidate: 300, tags: ["posts"] }
  )(); // 즉시 실행
}

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") ?? undefined;
    const tag = req.nextUrl.searchParams.get("tag") ?? "all";

    const datetype = (req.nextUrl.searchParams.get("datetype") as "week" | "month" | "year" | "all") ?? "all";

    let page;
    if (cursor) {
      page = await getPostsPageRaw({ cursor, tag, datetype });
    } else {
      page = await getPostsPageCached(tag, datetype);
    }

    return NextResponse.json(page);
  } catch (e) {
    console.error("❌ GET /api/posts 에러:", e);
    if (e instanceof Error) {
      return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
    return NextResponse.json({ ok: false, error: "Unknown error" }, { status: 500 });
  }
}

//글 작성시 revalidateTag를 통한 서버캐시 업데이트
export const POST = async (req: NextRequest) => {
  const jsonData = await req.json();
  const { content, tag, title, images, preview, thumbnail, isTemp, slug } = jsonData as PostType & { images: Image[] };
  let newSlug = slug;
  try {
    const result = await db.$transaction(async (tx) => {
      const existing = await db.post.findUnique({
        where: { slug },
      });

      if (existing) {
        newSlug = await createUniqueSlug(slug);
      }
      const post = await tx.post.create({
        data: {
          content,
          title,
          preview,
          thumbnail,
          isTemp,
          slug: newSlug,
          images: {
            connect: images.map((img) => ({ id: img.id })),
          },
        },
      });
      if (thumbnail) {
        await tx.image.update({
          where: {
            imageId: thumbnail,
          },
          data: {
            isThumb: true,
            post: {
              connect: {
                id: post.id,
              },
            },
          },
        });
      }
      const tags = [];
      for (const body of tag) {
        const _tag = await tx.tag.upsert({
          where: { body },
          create: {
            body,
            isTemp: post.isTemp, // 새로 생성되는 태그는 post.isTemp 따라감
            posts: {
              connect: { id: post.id },
            },
          },
          update: {
            // 이미 있는 태그라면 isTemp는 건드리지 않음
            posts: {
              connect: { id: post.id },
            },
          },
        });
        if (!_tag.isTemp) tags.push(_tag);
      }
      return { post, tags };
    });

    revalidateTag(`posts`);

    return NextResponse.json({
      ok: true,
      data: {
        post: result.post,
        tag: result.tags,
      },
    });
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
    return NextResponse.json({ ok: false, error: "Unknown error" }, { status: 500 });
  }
};
