import { createUniqueSlug } from "@/app/hooks/useUtil";
import { db } from "@/app/lib/db";
import { Comment } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const page = req.nextUrl.searchParams.get("page");
    const pageNumber = page ? parseInt(page, 10) : 0;
    const totalCount = await db.comment.count({});
    const commentsData = await db.comment.findMany({
      take: 12,
      skip: pageNumber * 12,
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({
      ok: true,
      data: commentsData,
      totalCount,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  } finally {
  }
};

export const POST = async (req: NextRequest) => {
  try {
    let { content, name, isMe } = (await req.json()) as Comment;
    console.log(isMe);
    const commentData = await db.comment.create({
      data: {
        content,
        name,
        isMe,
      },
    });
    return NextResponse.json({ ok: true, data: commentData });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "삭제할 코멘트 id가 필요합니다." },
        { status: 400 }
      );
    }
    const deleteComment = await db.comment.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      ok: true,
      data: deleteComment,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
};
