import { db } from "@/app/lib/db";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (res: NextResponse, req: NextRequest) => {
  try {
  } catch (error) {
  } finally {
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const result = await db.$transaction(async (tx) => {
      let jsonData = await req.json();

      const { content, tag, title, imageIds } = jsonData.data as FormType;

      const post = await tx.post.create({
        data: {
          content,
          title,
          imageIds,
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
