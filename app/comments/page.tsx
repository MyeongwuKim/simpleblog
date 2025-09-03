import InfiniteScrollProvider from "@/components/layout/InfiniteScroll/infiniteScrollProvider";
import {
  dehydrate,
  HydrationBoundary,
  InfiniteData,
} from "@tanstack/react-query";
import getQueryClient from "../hooks/useQueryClient";
import { fetchComments } from "../lib/fetchers/comments";
import CommentsLayout from "@/components/comments/commentsLayout";
import { Comment } from "@prisma/client";

export default async function Comments() {
  const queryClient = getQueryClient();
  const queryKey = ["comments"];

  await queryClient.prefetchInfiniteQuery<
    InfiniteResponse<Comment>,
    Error,
    InfiniteData<InfiniteResponse<Comment>>,
    typeof queryKey,
    string | null // ✅ string도 가능하게
  >({
    queryKey,
    queryFn: ({ pageParam }) => {
      return fetchComments(pageParam ?? undefined);
    },
    initialPageParam: null,
    getNextPageParam: (lastPage: InfiniteResponse<Comment>) =>
      lastPage.nextCursor ?? undefined,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="max-w-[768px]  w-full ml-auto mr-auto relative">
        <CommentsLayout />
        <InfiniteScrollProvider
          staleTime={30 * 1000}
          queryKey={queryKey}
          type="comments"
        />
      </div>
    </HydrationBoundary>
  );
}
