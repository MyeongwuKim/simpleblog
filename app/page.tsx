import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import getQueryClient from "./hooks/useQueryClient";
import { fetchPosts } from "./lib/fetchers/post";
import InfiniteScrollProvider from "@/components/layout/InfiniteScroll/infiniteScrollProvider";
import { CardItem } from "@/components/ui/items/cardItem";
import { CardItemSkeleton } from "@/components/ui/skeleton";

interface SearchParams {
  searchParams: {
    tag?: string;
  };
}

export default async function Home({ searchParams }: SearchParams) {
  const queryClient = getQueryClient();
  const { tag } = await searchParams;

  const queryKey = !tag ? ["post"] : ["post", tag];

  await queryClient.prefetchInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchPosts(pageParam, queryKey),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return pages.length;
    },
    pages: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InfiniteScrollProvider queryKey={queryKey} type="post" />
    </HydrationBoundary>
  );
}
