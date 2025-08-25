import { createUniqueSlug } from "@/app/hooks/useUtil";
import { db } from "@/app/lib/db";
import { Comment } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const page = req.nextUrl.searchParams.get("page");
    const pageNumber = page ? parseInt(page, 10) : 0;
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
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  } finally {
  }
};

export const POST = async (req: NextRequest) => {
  try {
    let { content, name } = (await req.json()) as Comment;
    const commentData = await db.comment.create({
      data: {
        content,
        name,
      },
    });
    return NextResponse.json({ ok: true, data: commentData });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const { id } = await req.json();

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
