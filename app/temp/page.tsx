import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import getQueryClient from "../hooks/useQueryClient";
import { fetchTempPosts } from "../lib/fetchers/post";
import InfiniteScrollProvider from "@/components/layout/InfiniteScroll/infiniteScrollProvider";

export default async function Temp() {
  const queryClient = getQueryClient();
  const queryKey = ["temp"];

  await queryClient.prefetchInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchTempPosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return pages.length;
    },
    pages: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="max-w-[768px]  w-full ml-auto mr-auto relative">
        <InfiniteScrollProvider queryKey={queryKey} type="temp" />
      </div>
    </HydrationBoundary>
  );
}
