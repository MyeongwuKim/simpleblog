import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { streamId, postId } = body as {
      streamId: string;
      postId?: string;
    };

    if (!streamId) {
      return NextResponse.json(
        { ok: false, error: "streamId is required" },
        { status: 400 }
      );
    }

    const existing = await db.video.findUnique({
      where: { streamId },
    });

    if (existing) {
      return NextResponse.json({ ok: true, data: existing });
    }

    const createdVideo = await db.video.create({
      data: {
        streamId,
        postId: postId ?? null,
      },
    });

    return NextResponse.json({ ok: true, data: createdVideo });
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
};
