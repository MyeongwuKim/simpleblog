import { createUniqueSlug } from "@/app/hooks/useUtil";
import { db } from "@/app/lib/db";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { postId: string } }
) => {
  const { postId } = await params;
  const type = req.nextUrl.searchParams.get("type");
  try {
    const postData = await db.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        content: true,
        isTemp: true,
        createdAt: true,
        slug: true,
        tag: {
          select: {
            body: true,
          },
        },
      },
    });

    // 이전 글 (더 오래된 글)
    const prevPost = await db.post.findFirst({
      where: {
        createdAt: { lt: postData?.createdAt }, // 현재 글보다 이전
      },
      orderBy: { createdAt: "desc" }, // 가장 가까운 이전 글
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    // 다음 글 (더 최신 글)
    const nextPost = await db.post.findFirst({
      where: {
        createdAt: { gt: postData?.createdAt }, // 현재 글보다 이후
      },
      orderBy: { createdAt: "asc" }, // 가장 가까운 다음 글
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    return NextResponse.json({
      ok: true,
      data: {
        current: postData,
        ...(type ? { prev: prevPost, next: nextPost } : {}),
      },
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

export const POST = async (
  req: NextRequest,
  { params }: { params: { postId: string } }
) => {
  const { postId } = await params;
  let jsonData = await req.json();

  let { content, tag, title, imageIds, preview, thumbnail, isTemp, createdAt } =
    jsonData as PostType & { createdAt: Date };

  try {
    const result = await db.$transaction(async (tx) => {
      const post = await tx.post.update({
        where: { id: postId },
        data: {
          content,
          title,
          imageIds,
          preview,
          thumbnail,
          isTemp,

          ...(createdAt ? { createdAt } : {}),
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
                id: postId,
              },
            },
          },
          update: {
            posts: {
              connect: {
                id: postId,
              },
            },
          },
        });
        tags.push(_tag);
      }
      return { post };
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
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { postId: string } }
) => {
  const { postId } = await params;

  try {
    const postData = await db.post.delete({
      where: {
        id: postId,
      },
    });
    postData.imageIds.forEach((id) => {
      fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT}/images/v1/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.CF_TOKEN}`,
          },
        }
      ).catch((err) => console.error("삭제 실패:", err));
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
