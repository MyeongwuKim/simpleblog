import { db } from "@/app/lib/db";

import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const page = req.nextUrl.searchParams.get("page");
  const type = req.nextUrl.searchParams.get("type");
  const pageNumber = page ? parseInt(page, 10) : 0;

  try {
    const postData = await db.post.findMany({
      where: {
        NOT: { isTemp: type != "temp" },
      },
      select: {
        ...(type !== "temp"
          ? {
              createdAt: true,
              thumbnail: true,
            }
          : {
              updatedAt: true,
            }),
        id: true,
        slug: true,
        preview: true,
        title: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      ok: true,
      data: postData,
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
  }
};

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

export const POST = async (req: NextRequest) => {
  let jsonData = await req.json();
  let { content, tag, title, imageIds, preview, thumbnail, isTemp, slug } =
    jsonData.data as PostType;
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
