import { db } from "@/app/lib/db";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
) => {
  const { slug } = await params;
  try {
    const postData = await db.post.findUnique({
      where: { slug },
      select: {
        id: true,
      },
    });
    return NextResponse.json({
      ok: true,
      data: postData,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  } finally {
  }
};
