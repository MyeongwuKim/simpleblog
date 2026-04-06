import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function cleanupVideo() {
  const orphans = await db.video.findMany({
    where: { postId: null },
    select: { id: true, streamId: true },
  });

  console.log(`🗑 Found ${orphans.length} orphan videos`);

  for (const orphan of orphans) {
    try {
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT}/stream/${orphan.streamId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.CF_VIDEO_TOKEN}`,
          },
        }
      );
      console.log(`✅ Deleted Cloudflare video: ${orphan.streamId}`);
    } catch (err) {
      console.error(
        `❌ Failed to delete Cloudflare video: ${orphan.streamId}`,
        err
      );
    }
  }

  const orphanIds = orphans.map((o) => o.id);
  if (orphanIds.length > 0) {
    await db.video.deleteMany({
      where: { id: { in: orphanIds } },
    });
    console.log(`🗑 Deleted ${orphanIds.length} orphan video DB records`);
  }

  return { ok: true };
}

export const POST = async (req: NextRequest) => {
  const token = req.headers.get("x-cron-token");
  if (token !== process.env.CRON_SECRET) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const result = await cleanupVideo();
    return NextResponse.json(result);
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const result = await cleanupVideo();
    return NextResponse.json(result);
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
};
