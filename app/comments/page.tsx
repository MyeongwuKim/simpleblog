import InfiniteScrollProvider from "@/components/layout/InfiniteScroll/infiniteScrollProvider";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import getQueryClient from "../hooks/useQueryClient";
import { fetchComments } from "../lib/fetchers/comments";
import CommentsLayout from "@/components/comments/commentsLayout";

export default async function Comments() {
  const queryClient = getQueryClient();
  const queryKey = ["comments"];
  await queryClient.prefetchInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam, queryKey }) => {
      const [, params] = queryKey as [
        string,
        { tag?: string; datetype?: string }
      ];
      return fetchComments(pageParam ?? 0);
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
      <div className="max-w-[768px]  w-full ml-auto mr-auto relative">
        <CommentsLayout />
        <InfiniteScrollProvider queryKey={queryKey} type="comments" />
      </div>
    </HydrationBoundary>
  );
}
