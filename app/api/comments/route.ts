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
    const { content, name, isMe, token } = (await req.json()) as Comment & {
      token: unknown;
    };

    //  reCAPTCHA 검증
    const secret = process.env.RECAPTCHA_SECRET_KEY!;
    const verifyRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${secret}&response=${token}`,
      }
    );

    const verification = await verifyRes.json();

    if (!verification.success) {
      return NextResponse.json(
        { ok: false, error: "reCAPTCHA 인증 실패" },
        { status: 400 }
      );
    }

    const commentData = await db.comment.create({
      data: {
        content,
        name,
        isMe,
      },
    });
    return NextResponse.json({ ok: true, data: commentData });
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
