import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import getQueryClient from "./hooks/useQueryClient";
import { fetchPosts } from "./lib/fetchers/post";
import InfiniteScrollProvider from "@/components/layout/InfiniteScroll/infiniteScrollProvider";
import { notFound, redirect } from "next/navigation";
import { db } from "./lib/db";

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

  await queryClient.prefetchInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam, queryKey }) => {
      const [, params] = queryKey as [
        string,
        { tag?: string; datetype?: string }
      ];
      return fetchPosts(pageParam ?? 0, params ?? {});
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return pages.length;
    },
    staleTime: 0,
    pages: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InfiniteScrollProvider queryKey={queryKey} type="post" />
    </HydrationBoundary>
  );
}
