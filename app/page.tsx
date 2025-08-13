import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import getQueryClient from "./hooks/useQueryClient";
import InfiniteScrollPostArea from "@/components/layout/infiniteScrollPostArea";

const getFeedData = async (pageNumber: number) => {
  const url = `/api/post`;
  debugger;
  const result = await (await fetch(url, { cache: "no-store" })).json();
  return result;
};
export default async function Home() {
  const queryClient = getQueryClient();
  const queryKey = ["Post"];

  await queryClient.prefetchInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => getFeedData(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return pages.length;
    },
    pages: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full h-full">
        <InfiniteScrollPostArea queryKey={queryKey} />
      </div>
    </HydrationBoundary>
  );
}
