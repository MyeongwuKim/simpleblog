import { db } from "@/app/lib/db";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
  } catch (error) {
  } finally {
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const result = await db.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: {
          title: "새로운 포스트",
          content: "트랜잭션 테스트",
        },
      });

      return { post };
    });
    console.log("트랜잭션 성공:", result);
  } catch (error) {
    console.error("트랜잭션 실패, 모든 작업이 롤백되었습니다.", error);
  } finally {
    await db.$disconnect();
  }
};
