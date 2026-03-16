import { db } from "@/app/lib/db";
import { CollectionItem, Image, Prisma, Tag } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { revalidateTag } from "next/cache";
import { error } from "console";

/* ---------------- util ---------------- */

function reindexItems(items: CollectionItem[]) {
  return [...items]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((it, idx) => ({ ...it, order: idx }));
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

  const first = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0];

  const post = await tx.post.findUnique({
    where: { id: first.postId },
    select: { thumbnail: true },
  });

  await tx.collection.update({
    where: { id: collectionId },
    data: { thumbnail: post?.thumbnail ?? null },
  });
}

/* ---------------- collection sync ---------------- */

async function syncPostCollection({
  tx,
  postId,
  nextCollectionId,
}: {
  tx: Prisma.TransactionClient;
  postId: string;
  nextCollectionId: string | null;
}): Promise<{
  currentCollectionId: string | null;
  nextCollectionId: string | null;
} | null> {
  const post = await tx.post.findUnique({
    where: { id: postId },
    select: { collectionId: true },
  });
  if (!post) throw new Error("Post not found");

  const currentCollectionId = post.collectionId;

  const detach = async (collectionId: string) => {
    const col = await tx.collection.findUnique({
      where: { id: collectionId },
      select: { items: true },
    });
    if (!col) return;

    const items = reindexItems(col.items.filter((it) => it.postId !== postId));

    await tx.collection.update({
      where: { id: collectionId },
      data: { items: { set: items }, updatedAt: new Date() },
    });

    await updateCollectionThumbnailByItems(tx, collectionId, items);
  };

  const attach = async (collectionId: string) => {
    const col = await tx.collection.findUnique({
      where: { id: collectionId },
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
      where: { id: collectionId },
      data: { items: { set: items }, updatedAt: new Date() },
    });

    await updateCollectionThumbnailByItems(tx, collectionId, items);
  };

  // 1️⃣ 해제
  if (nextCollectionId === null) {
    if (currentCollectionId) {
      await detach(currentCollectionId);
      await tx.post.update({
        where: { id: postId },
        data: { collectionId: null },
      });
    }
    return null;
  }

  // 2️⃣ 동일 컬렉션
  if (currentCollectionId === nextCollectionId) return null;

  // 3️⃣ 이동
  if (currentCollectionId) await detach(currentCollectionId);
  await attach(nextCollectionId);

  await tx.post.update({
    where: { id: postId },
    data: { collectionId: nextCollectionId },
  });

  return { currentCollectionId, nextCollectionId };
}

/* ---------------- GET ---------------- */

export const GET = async (
  req: NextRequest,
  { params }: { params: { postId: string } }
) => {
  const { postId } = await params;

  if (!ObjectId.isValid(postId)) {
    return NextResponse.json({
      ok: false,
      data: null,
      error: "올바른 형태의 id가 아닙니다.",
    });
  }

  try {
    const postData = await db.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        content: true,
        isTemp: true,
        thumbnail: true,
        createdAt: true,
        slug: true,
        images: true,
        collectionId: true,
        collection: {
          select: { id: true, slug: true },
        },
        tag: {
          select: { body: true },
        },
      },
    });
    if (!postData) {
      return NextResponse.json(
        { ok: false, data: null, error: "존재하지 않는 글입니다" },
        { status: 200 }
      );
    }
    let thumbData = null;
    if (postData.thumbnail) {
      thumbData = await db.image.findUnique({
        where: {
          imageId: postData.thumbnail,
        },
        select: {
          width: true,
          height: true,
        },
      });
    }
    return NextResponse.json({ ok: true, data: { ...postData, thumbData } });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
};

/* ---------------- POST ---------------- */

export const POST = async (
  req: NextRequest,
  { params }: { params: { postId: string } }
) => {
  const { postId } = params;
  const jsonData = await req.json();

  const {
    content,
    tag,
    title,
    images,
    preview,
    thumbnail,
    isTemp,
    createdAt,
    collection,
  } = jsonData as PostType & {
    createdAt: Date;
    images: Image[];
  };

  try {
    const result = await db.$transaction(
      async (tx) => {
        const incomingIds = images.map((img) => img.imageId);

        const post = await tx.post.update({
          where: { id: postId },
          data: {
            content,
            title,
            preview,
            isTemp,
            thumbnail,
            ...(createdAt ? { createdAt } : {}),
            images: {
              set: [],
              connect: incomingIds.map((imageId) => ({ imageId })),
            },
          },
          include: { images: true },
        });

        // thumbnail (image)
        const currentThumb = await tx.image.findFirst({
          where: { postId, isThumb: true },
          select: { imageId: true },
        });

        if (thumbnail && currentThumb?.imageId !== thumbnail) {
          if (currentThumb?.imageId) {
            await tx.image.update({
              where: { imageId: currentThumb.imageId },
              data: { isThumb: false, post: { disconnect: true } },
            });
          }
          await tx.image.update({
            where: { imageId: thumbnail },
            data: { isThumb: true, post: { connect: { id: postId } } },
          });
        }

        if (!thumbnail && currentThumb?.imageId) {
          await tx.image.update({
            where: { imageId: currentThumb.imageId },
            data: { isThumb: false, post: { disconnect: true } },
          });
        }

        // tags (병렬)
        const tags: Tag[] = (
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
                  ...(post.isTemp === false ? { isTemp: false } : {}),
                  posts: { connect: { id: post.id } },
                },
              })
            )
          )
        ).filter((t) => !t.isTemp);

        const collectionId = collection
          ? (
              await tx.collection.findUnique({
                where: { slug: collection.slug },
                select: { id: true },
              })
            )?.id ?? null
          : null;

        const collectionResult = await syncPostCollection({
          tx,
          postId,
          nextCollectionId: collectionId,
        });

        return { post, tags, colletion: collectionResult };
      },
      { timeout: 15000 }
    );

    revalidateTag(`post:${postId}`);
    revalidateTag(`posts`);

    if (result.colletion) {
      const { currentCollectionId, nextCollectionId } = result.colletion;
      if (nextCollectionId) revalidateTag(`collections:${nextCollectionId}`);
      if (currentCollectionId)
        revalidateTag(`collections:${currentCollectionId}`);
    }

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
      { ok: false, error: "Post update failed" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { postId: string } }
) => {
  const { postId } = await params;

  try {
    const result = await db.$transaction(async (tx) => {
      // 1. 삭제할 post와 관련 태그들 가져오기
      const deletedPost = await tx.post.delete({
        where: { id: postId },
        select: { id: true, tagIds: true, images: true },
      });

      const tags: Tag[] = [];
      // 2. 태그별로 postIds 갱신
      for (const tagId of deletedPost.tagIds) {
        const tag = await tx.tag.findUnique({ where: { id: tagId } });

        if (!tag) continue;

        const newPostIds = tag.postIds.filter((pid) => pid !== deletedPost.id);

        let removeTag;
        if (newPostIds.length === 0) {
          // 연결된 post 없으면 태그 삭제
          removeTag = await tx.tag.delete({ where: { id: tagId } });
        } else {
          // 남은 postIds 업데이트
          removeTag = await tx.tag.update({
            where: { id: tagId },
            data: { postIds: { set: newPostIds } },
          });
        }
        tags.push(removeTag);
      }
      return {
        deletedPost,
        tags,
      };
    });
    if (!process.env.NEXT_PUBLIC_DEMO)
      result.deletedPost.images.forEach((image) => {
        fetch(
          `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT}/images/v1/${image.imageId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${process.env.CF_TOKEN}`,
            },
          }
        ).catch((err) => console.error("삭제 실패:", err));
      });

    revalidateTag(`posts`);

    return NextResponse.json({
      ok: true,
      data: {
        post: result.deletedPost,
        tag: result.tags,
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
