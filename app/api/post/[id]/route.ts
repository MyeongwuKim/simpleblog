import { db } from "@/app/lib/db";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = await params;
  try {
    const postData = await db.post.findUnique({
      where: { id },
      select: {
        title: true,
        content: true,
        createdAt: true,
        tag: {
          select: {
            body: true,
          },
        },
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
