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
            posts: {
              connect: {
                id: post.id,
              },
            },
          },
          update: {
            posts: {
              connect: {
                id: post.id,
              },
            },
          },
        });
        tags.push(_tag);
      }
      return { post, tags };
    });
    return NextResponse.json({
      ok: true,
      data: result.post,
    });
  } catch (e: any) {
    let error = e?.code
      ? `Prisma errorCode:${e.code}, Prisma Error ${JSON.stringify(e.meta)}`
      : `일시적 오류입니다. 다시 시도해주세요.`;
    return NextResponse.json({
      ok: false,
      error,
    });
  } finally {
    await db.$disconnect();
  }
};
