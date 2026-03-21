import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, unstable_cache } from "next/cache";
import { CollectionItem, Image, Prisma } from "@prisma/client";

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
  if (datetype === "week")
    dateCondition = { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
  if (datetype === "month")
    dateCondition = { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
  if (datetype === "year")
    dateCondition = { gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) };

  const take = 12;

  const data = await db.post.findMany({
    where: {
      isTemp: { equals: false },
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

// 2) 캐시 팩토리 함수
function getPostsPageCached(
  tag: string,
  datetype: "week" | "month" | "year" | "all"
) {
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

    const datetype =
      (req.nextUrl.searchParams.get("datetype") as
        | "week"
        | "month"
        | "year"
        | "all") ?? "all";

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

async function updateCollectionThumbnailByItems(
  tx: Prisma.TransactionClient,
  collectionId: string,
  items: CollectionItem[]
) {
  if (items.length === 0) {
    await tx.collection.update({
      where: { id: collectionId },
      data: { thumbnail: null },
    });
    return;
  }

  const first = items.reduce((a, b) =>
    (a.order ?? 0) < (b.order ?? 0) ? a : b
  );

  const post = await tx.post.findUnique({
    where: { id: first.postId },
    select: { thumbnail: true },
  });

  await tx.collection.update({
    where: { id: collectionId },
    data: { thumbnail: post?.thumbnail ?? null },
  });
}

async function createUniqueSlugOutsideTx(base: string) {
  let slug = base;
  while (true) {
    const exists = await db.post.findUnique({ where: { slug } });
    if (!exists) return slug;
    slug = `${base}-${Math.random().toString(36).slice(2, 9)}`;
  }
}

/* ================== GET (그대로 유지) ================== */
// ⬇️ GET 부분은 이미 충분히 최적화되어 있어서 변경 없음
// (네가 올린 코드 그대로 써도 됨)

/* ================== collection sync ================== */

async function syncPostCollection({
  tx,
  postId,
  nextCollectionId,
}: {
  tx: Prisma.TransactionClient;
  postId: string;
  nextCollectionId: string | null;
}) {
  if (!nextCollectionId) return;

  const col = await tx.collection.findUnique({
    where: { id: nextCollectionId },
    select: { items: true },
  });
  if (!col) throw new Error("Collection not found");

  const base = col.items.filter((it) => it.postId !== postId);
  const nextOrder =
    base.length === 0 ? 0 : Math.max(...base.map((it) => it.order ?? 0)) + 1;

  const items: CollectionItem[] = [
    ...base,
    { postId, order: nextOrder, createdAt: new Date() },
  ];

  await tx.collection.update({
    where: { id: nextCollectionId },
    data: {
      items: { set: items },
      updatedAt: new Date(),
    },
  });

  await tx.post.update({
    where: { id: postId },
    data: { collectionId: nextCollectionId },
  });

  await updateCollectionThumbnailByItems(tx, nextCollectionId, items);
}

/* ================== POST ================== */

export const POST = async (req: NextRequest) => {
  const jsonData = await req.json();
  const {
    content,
    tag,
    title,
    images,
    preview,
    thumbnail,
    isTemp,
    slug,
    collection,
  } = jsonData as PostType & { images: Image[] };

  try {
    // ✅ slug 유니크 처리: 트랜잭션 밖
    const finalSlug = await createUniqueSlugOutsideTx(slug);

    const result = await db.$transaction(
      async (tx) => {
        const post = await tx.post.create({
          data: {
            content,
            title,
            preview,
            thumbnail,
            isTemp,
            slug: finalSlug,
            images: {
              connect: images.map((img) => ({ id: img.id })),
            },
          },
        });

        // thumbnail image
        if (thumbnail) {
          await tx.image.update({
            where: { imageId: thumbnail },
            data: {
              isThumb: true,
              post: { connect: { id: post.id } },
            },
          });
        }

        // ✅ tag upsert 병렬
        const tags = (
          await Promise.all(
            tag.map((body) =>
              tx.tag.upsert({
                where: { body },
                create: {
                  body,
                  isTemp: post.isTemp,
                  posts: { connect: { id: post.id } },
                },
                update: {
                  posts: { connect: { id: post.id } },
                },
              })
            )
          )
        ).filter((t) => !t.isTemp);

        // collection attach (정식 글만)
        if (collection && !post.isTemp) {
          const collectionId = (
            await tx.collection.findUnique({
              where: { slug: collection.slug },
              select: { id: true },
            })
          )?.id;

          if (collectionId) {
            await syncPostCollection({
              tx,
              postId: post.id,
              nextCollectionId: collectionId,
            });
          }
        }

        return { post, tags };
      },
      { timeout: 10000 }
    );

    revalidateTag("posts");
    if (collection) revalidateTag(`collections:${collection.id}`);

    return NextResponse.json({
      ok: true,
      data: {
        post: result.post,
        tag: result.tags,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "Post create failed" },
      { status: 500 }
    );
  }
};
