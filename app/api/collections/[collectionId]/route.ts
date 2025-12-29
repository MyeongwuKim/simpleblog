import { db } from "@/app/lib/db";
import { Collection, CollectionItem, Prisma } from "@prisma/client";
import { ObjectId } from "mongodb";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  const { collectionId } = await params;

  if (!ObjectId.isValid(collectionId)) {
    return NextResponse.json({ ok: false, data: null });
  }

  try {
    const collectionData = await db.collection.findUnique({
      where: {
        id: collectionId,
      },
      select: {
        title: true,
        items: true,
      },
    });
    if (!collectionData) {
      return NextResponse.json(
        { ok: false, data: null, error: "존재하지 않는 컬렉션 입니다." },
        { status: 200 }
      );
    }

    // 🔥 항상 여기서 정렬
    const items = collectionData.items
      .slice() // 원본 보호
      .sort((a, b) => a.order - b.order);

    // 2️⃣ posts fetch
    const postsRaw = await db.post.findMany({
      where: {
        id: {
          in: items.map((item) => item.postId),
        },
      },
      select: {
        id: true,
        title: true,
        preview: true,
        slug: true,
        thumbnail: true,
        createdAt: true,
      },
    });

    // 3️⃣ map으로 순서 맞추기
    const postMap = new Map(postsRaw.map((p) => [p.id, p]));

    const posts = items.map((item) => postMap.get(item.postId)).filter(Boolean); // 혹시 누락 대비

    return NextResponse.json({
      ok: true,
      data: { title: collectionData.title, items: posts },
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

export const POST = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  const { collectionId } = await params;

  try {
    const jsonData = (await req.json()) as {
      title?: string;
      items?: {
        postId: string;
        order: number;
      }[];
    };

    const { title, items } = jsonData;

    // 1) 기존 컬렉션 조회
    const collection = await db.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      return NextResponse.json(
        { ok: false, error: "Collection not found" },
        { status: 404 }
      );
    }

    // 2) 업데이트 data 조립
    const updateData: Prisma.CollectionUpdateInput = {
      updatedAt: new Date(),
    };

    if (title !== undefined) {
      updateData.title = title;
    }

    if (items !== undefined) {
      const orderMap = new Map(items.map((item) => [item.postId, item.order]));

      updateData.items = {
        set: collection.items.map((item) => ({
          postId: item.postId,
          order: orderMap.get(item.postId) ?? item.order,
          createdAt: item.createdAt,
        })),
      };

      // 대표 thumbnail 갱신 (첫 아이템 기준)
      const first = [...items].sort((a, b) => a.order - b.order)[0];
      if (first) {
        const post = await db.post.findUnique({
          where: { id: first.postId },
          select: { thumbnail: true },
        });

        if (post) {
          updateData.thumbnail = post.thumbnail;
        }
      }
    }

    // 3) 업데이트
    await db.collection.update({
      where: { id: collectionId },
      data: updateData,
    });

    // 4) 최신 컬렉션 다시 조회 (🔥 핵심)
    const updatedCollection = await db.collection.findUnique({
      where: { id: collectionId },
    });

    revalidateTag(`collections:${collectionId}`);

    return NextResponse.json({
      ok: true,
      data: updatedCollection,
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

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  const { collectionId } = await params;
  try {
    // 1) 기존 컬렉션 조회
    const collection = await db.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      return NextResponse.json(
        { ok: false, error: "Collection not found" },
        { status: 404 }
      );
    }
    await db.collection.delete({
      where: {
        id: collectionId,
      },
    });
    //컬렉션 삭제하고 난뒤 묶여있는 글들을 업데이트함(서버 캐싱중)
    revalidateTag("post");
    return NextResponse.json({
      ok: true,
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
