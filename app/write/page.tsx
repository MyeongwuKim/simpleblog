// app/write/page.tsx

import { db } from "@/app/lib/db";
import WriteClient from "./writeClient";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchPostContentByPostId } from "../lib/fetchers/post";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type PageProps = {
  searchParams: Promise<{ id?: string }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { id } = await searchParams;

  // /write
  if (!id) {
    return {
      title: "글 작성",
    };
  }

  // 잘못된 ObjectId 형식
  if (!/^[a-f\d]{24}$/i.test(id)) {
    return {
      title: "404",
    };
  }

  const post = await db.post.findUnique({
    where: { id },
    select: {
      isTemp: true,
      title: true,
    },
  });

  if (!post) {
    return {
      title: "404",
    };
  }

  return {
    title: `(작성중) ${post.title}`,
  };
}

export default async function Write({ searchParams }: PageProps) {
  const { id } = await searchParams;

  // /write -> 새 글 작성
  if (!id) {
    return <WriteClient postId={""} />;
  }

  // 잘못된 ObjectId 형식
  if (!/^[a-f\d]{24}$/i.test(id)) {
    notFound();
  }

  const post = await db.post.findUnique({
    where: { id },
    select: {
      title: true,
      isTemp: true,
    },
  });

  // 없거나, 임시글이 아니면 수정 페이지 접근 불가
  if (!post) {
    notFound();
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPostContentByPostId(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WriteClient postId={id} />
    </HydrationBoundary>
  );
}
