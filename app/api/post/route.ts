import { createUniqueSlug } from "@/app/hooks/useUtil";
import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

import { unstable_cache } from "next/cache";

export const GET = async (req: NextRequest) => {
  const cursor = req.nextUrl.searchParams.get("cursor");
  const tagStr = req.nextUrl.searchParams.get("tag");
  const type = req.nextUrl.searchParams.get("type");
  const datetype = req.nextUrl.searchParams.get("datetype");

  const tagFilter = !!tagStr && tagStr !== "undefined";

  if (tagFilter) {
    const exist = await db.tag.findUnique({
      where: { body: tagStr },
    });

    if (!exist) {
      return NextResponse.json(
        { ok: false, error: "존재하지 않는 태그" },
        { status: 200 }
      );
    }
  }
  let dateCondition = {};
  if (datetype === "week") {
    dateCondition = { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
  } else if (datetype === "month") {
    dateCondition = { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
  } else if (datetype === "year") {
    dateCondition = { gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) };
  }
  try {
    const postData = await db.post.findMany({
      where: {
        isTemp: type === "temp",
        ...(tagFilter
          ? {
              tag: {
                some: {
                  body: { equals: tagStr! },
                },
              },
            }
          : {}),
        ...(datetype ? { createdAt: dateCondition } : {}),
      },
      select: {
        ...(type !== "temp"
          ? { createdAt: true, thumbnail: true }
          : { updatedAt: true }),
        id: true,
        slug: true,
        preview: true,
        title: true,
      },
      take: 12,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(postData);
    return NextResponse.json({
      ok: true,
      data: postData,
      nextCursor: postData.length > 0 ? postData[postData.length - 1].id : null,
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

export const POST = async (req: NextRequest) => {
  const jsonData = await req.json();
  const { content, tag, title, imageIds, preview, thumbnail, isTemp, slug } =
    jsonData as PostType;
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
          imageIds,
          preview,
          thumbnail,
          isTemp,
          slug: newSlug,
        },
      });
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

    return NextResponse.json({
      ok: true,
      data: {
        post: result.post,
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
