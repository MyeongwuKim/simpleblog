import { db } from "@/app/lib/db";
import { CollectionItem, Image, Prisma, Tag } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { revalidateTag } from "next/cache";

export const GET = async (
  req: NextRequest,
  { params }: { params: { postId: string } }
) => {
  const { postId } = await params;

  if (!ObjectId.isValid(postId)) {
    return NextResponse.json({ ok: false, data: null });
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
          select: {
            id: true,
            slug: true,
          },
        },
        tag: {
          select: {
            body: true,
          },
        },
      },
    });
    if (!postData) {
      return NextResponse.json(
        { ok: false, data: null, error: "존재하지 않는 글입니다" },
        { status: 200 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: postData,
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

function reindexItems(items: CollectionItem[]) {
  return [...items]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((it, idx) => ({ ...it, order: idx }));
}

const syncCollectionThumbnail = async (
  collectionId: string,
  tx: Prisma.TransactionClient
) => {
  const col = await tx.collection.findUnique({
    where: { id: collectionId },
    select: {
      items: true,
    },
  });
  if (!col || col.items.length === 0) {
    await tx.collection.update({
      where: { id: collectionId },
      data: { thumbnail: null },
    });
    return;
  }

  const firstItem = col.items
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0];

  const post = await tx.post.findUnique({
    where: { id: firstItem.postId },
    select: { thumbnail: true },
  });

  await tx.collection.update({
    where: { id: collectionId },
    data: {
      thumbnail: post?.thumbnail ?? null,
    },
  });
};

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
  // 현재 post 상태
  const post = await tx.post.findUnique({
    where: { id: postId },
    select: {
      collectionId: true,

      createdAt: true,
    },
  });

  if (!post) throw new Error("Post not found");

  const currentCollectionId = post.collectionId;

  /** helper: detach */
  const detach = async (collectionId: string) => {
    const col = await tx.collection.findUnique({
      where: { id: collectionId },
      select: { items: true },
    });
    if (!col) return;

    const filtered = col.items.filter((it) => it.postId !== postId);
    const reindexed = reindexItems(filtered);

    await tx.collection.update({
      where: { id: collectionId },
      data: { items: { set: reindexed }, updatedAt: new Date() },
    });
    await syncCollectionThumbnail(collectionId, tx);
  };

  /** helper: attach */
  const attach = async (collectionId: string) => {
    const col = await tx.collection.findUnique({
      where: { id: collectionId },
      select: { items: true },
    });
    if (!col) throw new Error("Collection not found");

    const items = col.items.filter((it) => it.postId !== postId);
    const nextOrder =
      items.length === 0
        ? 0
        : Math.max(...items.map((it) => it.order ?? 0)) + 1;

    await tx.collection.update({
      where: { id: collectionId },
      data: {
        updatedAt: new Date(),
        items: {
          set: [
            ...items,
            {
              postId,
              order: nextOrder,
            },
          ],
        },
      },
    });
    await syncCollectionThumbnail(collectionId, tx);
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

  // 2️⃣ 동일 컬렉션 → noop
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

//글 업데이트시 revalidateTag통한 글목록과 해당글 캐시업데이트
export const POST = async (
  req: NextRequest,
  { params }: { params: { postId: string } }
) => {
  const { postId } = await params;
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
    slug,
  } = jsonData as PostType & {
    createdAt: Date;
    images: Image[];
  };

  try {
    const result = await db.$transaction(async (tx) => {
      const incomingIds = images.map((img) => img.imageId);

      // 3. Post 업데이트 (연결 갱신)
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

      // 현재 DB에 설정된 썸네일 찾기
      const currentThumb = await tx.image.findFirst({
        where: { postId, isThumb: true },
        select: { imageId: true },
      });

      if (thumbnail) {
        // thumbnail 값이 변경된 경우만 업데이트
        if (!currentThumb || currentThumb.imageId !== thumbnail) {
          // 기존 썸네일 해제
          if (currentThumb?.imageId) {
            await tx.image.update({
              where: {
                imageId: currentThumb?.imageId,
              },
              data: {
                isThumb: false,
                post: {
                  disconnect: true,
                },
              },
            });
          }
          // 새 썸네일 지정
          await tx.image.update({
            where: { imageId: thumbnail },
            data: {
              isThumb: true,
              post: {
                connect: {
                  id: postId,
                },
              },
            },
          });
        }
      } else {
        if (currentThumb?.imageId) {
          await tx.image.update({
            where: { imageId: currentThumb.imageId },
            data: { isThumb: false, post: { disconnect: true } },
          });
        }
      }

      const tags: Tag[] = [];
      for (const body of tag) {
        const _tag = await tx.tag.upsert({
          where: { body },
          create: {
            body,
            isTemp: post.isTemp, // 새 태그는 글 상태 따라감
            posts: { connect: { id: post.id } },
          },
          update: {
            // 정식 글이 달리면 태그는 즉시 영구 태그가 됨
            ...(post.isTemp === false ? { isTemp: false } : {}),
            posts: { connect: { id: post.id } },
          },
        });
        if (!_tag.isTemp) tags.push(_tag);
      }
      // 2️⃣ 컬렉션 동기화
      const collectionResult = await syncPostCollection({
        tx,
        postId,
        nextCollectionId: collection?.id ?? null,
      });

      return { post, tags, colletion: collectionResult };
    });

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
  } catch (e: unknown) {
    console.error(e);
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
