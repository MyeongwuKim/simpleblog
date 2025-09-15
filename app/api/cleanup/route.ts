import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const token = req.headers.get("x-cron-token");
  if (token !== process.env.CRON_SECRET) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const orphans = await db.image.findMany({
      where: { postId: null },
      select: { id: true, imageId: true },
    });

    console.log(`🗑 Found ${orphans.length} orphan images`);
    // 2. Cloudflare API 호출해서 파일 삭제
    for (const orphan of orphans) {
      try {
        await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT}/images/v1/${orphan.imageId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${process.env.CF_TOKEN}`,
            },
          }
        );
        console.log(`✅ Deleted Cloudflare image: ${orphan.imageId}`);
      } catch (err) {
        console.error(
          `❌ Failed to delete Cloudflare image: ${orphan.imageId}`,
          err
        );
      }
    }

    // 3. DB에서 삭제
    const orphanIds = orphans.map((o) => o.id);
    if (orphanIds.length > 0) {
      await db.image.deleteMany({
        where: { id: { in: orphanIds } },
      });
      console.log(`🗑 Deleted ${orphanIds.length} orphan DB records`);
    }
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
};
