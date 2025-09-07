import InfiniteScrollProvider from "@/components/layout/InfiniteScroll/infiniteScrollProvider";
import getQueryClient from "../hooks/useQueryClient";
import CommentsLayout from "@/components/comments/commentsLayout";
import { Comment } from "@prisma/client";

export default async function Comments() {
  const queryKey = ["comments"];

  // console.log(
  //   "서버 queryClient 상태:",
  //   queryClient.getQueryCache().find({ queryKey: ["comments"] })
  // );

  // const state = dehydrate(queryClient);
  // console.log("dehydrate 결과(JSON):", state);

  return (
    <div className="layout relative">
      <CommentsLayout />
      <InfiniteScrollProvider
        staleTime={30 * 1000}
        queryKey={queryKey}
        type="comments"
      />
    </div>
  );
}
