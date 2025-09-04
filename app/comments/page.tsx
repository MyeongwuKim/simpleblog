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

  // console.log(
  //   "서버 queryClient 상태:",
  //   queryClient.getQueryCache().find({ queryKey: ["comments"] })
  // );

  // const state = dehydrate(queryClient);
  // console.log("dehydrate 결과(JSON):", state);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="layout relative">
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
