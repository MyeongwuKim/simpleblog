import { unstable_cache } from "next/cache";
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/app/lib/db";
import { Collection } from "@prisma/client";

export const GET = async (req: NextRequest) => {
  const mode = req.nextUrl.searchParams.get("mode"); // "feed" | "all" | null
  try {
    if (mode == "all") {
      const collectionData = await db.collection.findMany({
        select: {
          updatedAt: true,
          id: true,
          slug: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return NextResponse.json({
        ok: true,
        data: collectionData,
      });
    } else {
      const cursor = req.nextUrl.searchParams.get("cursor");
      const collectionData = await db.collection.findMany({
        take: 12,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}), // ✅ 수정
        select: {
          updatedAt: true,
          id: true,
          slug: true,
          title: true,
          thumbnail: true,
          _count: {
            select: {
              posts: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      return NextResponse.json({
        ok: true,
        data: collectionData,
        nextCursor:
          collectionData.length > 0
            ? collectionData[collectionData.length - 1].id
            : null,
      });
    }
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

export const POST = async (req: NextRequest) => {
  try {
    const jsonData = await req.json();

    const { slug } = jsonData as Collection;
    const result = await db.collection.findUnique({
      where: { slug },
    });
    if (result) {
      return NextResponse.json(
        { ok: false, data: null, error: "중복된 컬렉션 이름입니다." },
        { status: 200 }
      );
    }
    console.log(slug);
    await db.collection.create({
      data: {
        slug,
        title: slug,
      },
    });
    return NextResponse.json({ ok: true });
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
