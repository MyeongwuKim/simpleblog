import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import getQueryClient from "./hooks/useQueryClient";
import { fetchPosts } from "./lib/fetchers/post";
import InfiniteScrollProvider from "@/components/layout/InfiniteScroll/infiniteScrollProvider";

interface SearchParams {
  searchParams: {
    tag?: string;
    datetype?: string;
  };
}

export default async function Home({ searchParams }: SearchParams) {
  const queryClient = getQueryClient();
  const { tag, datetype } = await searchParams;
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
