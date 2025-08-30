import { db } from "@/app/lib/db";
import { fetchAllPostContentByPostId } from "@/app/lib/fetchers/post";
import NotFound from "@/app/not-found";
import CommonPost from "@/components/layout/commonPost";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";

// app/posts/[postId]/page.tsx
interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug); // ← 여기서 디코딩
  const post = await db.post.findUnique({
    where: {
      slug: decodedSlug,
    },
    select: {
      title: true,
    },
  });
  return {
    title: post?.title ?? "404",
    openGraph: {
      title: post?.title,
    },
  };
}

export default async function Post({ params }: PageProps) {
  const queryClient = new QueryClient();
  const { slug } = await params;

  const postData = await db.post.findUnique({
    where: { slug: decodeURIComponent(slug) },
    select: {
      id: true,
      tag: true,
    },
  });

  if (!postData) {
    return <NotFound />;
  }
  await queryClient.prefetchQuery({
    queryKey: ["post", postData.id],
    queryFn: () => fetchAllPostContentByPostId(postData.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommonPost postId={postData?.id} />
    </HydrationBoundary>
  );
}
