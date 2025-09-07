import {
  dehydrate,
  HydrationBoundary,
  InfiniteData,
} from "@tanstack/react-query";
import getQueryClient from "../hooks/useQueryClient";
import { fetchTempPosts } from "../lib/fetchers/post";
import InfiniteScrollProvider from "@/components/layout/InfiniteScroll/infiniteScrollProvider";
import { Post } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function Temp() {
  const queryClient = getQueryClient();
  const queryKey = ["temp"];

  await queryClient.prefetchInfiniteQuery<
    InfiniteResponse<Post>,
    Error,
    InfiniteData<InfiniteResponse<Post>>,
    typeof queryKey,
    string | null // ✅ string도 가능하게
  >({
    queryKey,
    queryFn: ({ pageParam }) => {
      return fetchTempPosts(pageParam ?? undefined);
    },
    initialPageParam: null,
    getNextPageParam: (lastPage: InfiniteResponse<Post>) =>
      lastPage.nextCursor ?? undefined,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="max-w-[768px]  w-full ml-auto mr-auto relative">
        <InfiniteScrollProvider staleTime={0} queryKey={queryKey} type="temp" />
      </div>
    </HydrationBoundary>
  );
}
