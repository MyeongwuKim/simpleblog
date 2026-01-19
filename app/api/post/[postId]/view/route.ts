function dayKey(date = new Date()) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0); // UTC 기준 하루
  return d;
}

function yesterdayKey() {
  const d = dayKey();
  d.setUTCDate(d.getUTCDate() - 1);
  return d;
}

function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "0.0.0.0";
}

import { db } from "@/app/lib/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const { postId } = await params;

  const today = dayKey();
  const yesterday = yesterdayKey();

  const [total, todayCount, yesterdayCount] = await Promise.all([
    // 전체
    db.postViewLog.count({
      where: { postId },
    }),

    // 오늘
    db.postViewLog.count({
      where: {
        postId,
        date: today,
      },
    }),

    // 어제
    db.postViewLog.count({
      where: {
        postId,
        date: yesterday,
      },
    }),
  ]);
  console.log(total);
  return NextResponse.json({
    ok: true,
    data: {
      total,
      today: todayCount,
      yesterday: yesterdayCount,
    },
  });
}

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const { postId } = await params;
  const ip = getClientIp(req);
  const date = dayKey();

  const ua = req.headers.get("user-agent") ?? "";
  if (/bot|crawl|spider/i.test(ua)) {
    return NextResponse.json({ ok: true });
  }

  try {
    await db.postViewLog.create({
      data: { postId, ip, date },
    });
  } catch (e: unknown) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return NextResponse.json({ ok: false });
    }

    console.error(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
