import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export const POST = async (req: NextRequest) => {
  try {
    const thumb = req.nextUrl.searchParams.get("thumb") ?? undefined;

    const body = await req.json();
    const { imageId, postId } = body as {
      imageId: string;
      postId?: string;
    };

    if (!imageId) {
      return NextResponse.json(
        { ok: false, error: "imageId is required" },
        { status: 400 }
      );
    }

    const createdImage = await db.image.create({
      data: {
        imageId,
        isThumb: thumb === "true", // 안전 변환
        postId: postId ?? null, // 글과 바로 연결할 수도 있고 나중에 연결할 수도 있음
      },
    });

    return NextResponse.json({ ok: true, data: createdImage });
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
};
