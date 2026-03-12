import InfiniteScrollProvider from "@/components/layout/InfiniteScroll/infiniteScrollProvider";

export default async function Temp() {
  // const queryClient = getQueryClient();
  const queryKey = ["temp"];

  // await queryClient.prefetchInfiniteQuery<
  //   InfiniteResponse<Post>,
  //   Error,
  //   InfiniteData<InfiniteResponse<Post>>,
  //   typeof queryKey,
  //   string | null // ✅ string도 가능하게
  // >({
  //   queryKey,
  //   queryFn: ({ pageParam }) => {
  //     return fetchTempPosts(pageParam ?? undefined);
  //   },
  //   initialPageParam: null,
  //   getNextPageParam: (lastPage: InfiniteResponse<Post>) =>
  //     lastPage.nextCursor ?? undefined,
  // });

  return (
    <div className="layout relative">
      <InfiniteScrollProvider queryKey={queryKey} type="temp" />
    </div>
  );
}
