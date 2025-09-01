import {
  dehydrate,
  HydrationBoundary,
  InfiniteData,
} from "@tanstack/react-query";
import getQueryClient from "./hooks/useQueryClient";
import { fetchPosts } from "./lib/fetchers/post";
import InfiniteScrollProvider from "@/components/layout/InfiniteScroll/infiniteScrollProvider";
import { redirect } from "next/navigation";
import { db } from "./lib/db";
import { Post } from "@prisma/client";

interface SearchParams {
  searchParams: {
    tag?: string;
    datetype?: string;
  };
}
const VALID_DATE_TYPES = ["year", "month", "week"];

export default async function Home({ searchParams }: SearchParams) {
  const queryClient = getQueryClient();

  const { tag, datetype } = await searchParams;

  if (datetype && !VALID_DATE_TYPES.includes(datetype)) {
    return redirect("/");
  }
  if (tag) {
    const exist = await db.tag.findUnique({ where: { body: tag } });
    if (!exist) {
      return redirect("/"); // 잘못된 태그면 전체로 보냄
    }
  }

  const queryKey =
    !tag && !datetype
      ? ["post"]
      : ["post", { ...(tag && { tag }), ...(datetype && { datetype }) }];

  await queryClient.prefetchInfiniteQuery<
    InfiniteResponse<Post>,
    Error,
    InfiniteData<InfiniteResponse<Post>>,
    typeof queryKey,
    string | null // ✅ string도 가능하게
  >({
    queryKey,
    queryFn: ({ pageParam, queryKey }) => {
      const [, params] = queryKey as [
        string,
        { tag?: string; datetype?: string }
      ];
      return fetchPosts(pageParam ?? undefined, params ?? {});
    },
    initialPageParam: null,
    getNextPageParam: (lastPage: InfiniteResponse<Post>) => {
      if (!lastPage.ok || lastPage.data.length === 0) return null;
      return lastPage.nextCursor ?? null;
    },
  });

  return (
    <HydrationBoundary
      state={dehydrate(queryClient, {
        shouldDehydrateQuery: (q) => q.queryKey[0] !== "post", // post는 제외
      })}
    >
      <InfiniteScrollProvider queryKey={queryKey} type="post" />
    </HydrationBoundary>
  );
}
