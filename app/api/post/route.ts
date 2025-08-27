import { createUniqueSlug } from "@/app/hooks/useUtil";
import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const page = req.nextUrl.searchParams.get("page");
  const tagStr = req.nextUrl.searchParams.get("tag");
  const type = req.nextUrl.searchParams.get("type");
  const datetype = req.nextUrl.searchParams.get("datetype");

  const pageNumber = page ? parseInt(page, 10) : 0;
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
    const totalCount = await db.post.count({
      where: {
        NOT: { isTemp: type != "temp" },
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
    });

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
      skip: pageNumber * 12,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      ok: true,
      data: postData,
      totalCount,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  } finally {
  }
};

export const POST = async (req: NextRequest) => {
  let jsonData = await req.json();
  let { content, tag, title, imageIds, preview, thumbnail, isTemp, slug } =
    jsonData as PostType;
  try {
    const result = await db.$transaction(async (tx) => {
      const existing = await db.post.findUnique({
        where: { slug },
      });

      if (existing) {
        slug = await createUniqueSlug(slug);
      }
      const post = await tx.post.create({
        data: {
          content,
          title,
          imageIds,
          preview,
          thumbnail,
          isTemp,
          slug,
        },
      });
      let tags = [];
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
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
};
