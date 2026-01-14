import InfiniteScrollProvider from "@/components/layout/InfiniteScroll/infiniteScrollProvider";

export default async function Collections() {
  const queryKey = ["collections"];

  return (
    <div className="layout relative">
      <InfiniteScrollProvider
        staleTime={30 * 1000}
        queryKey={queryKey}
        type="collections"
        refetchOnMount={true}
      />
    </div>
  );
}
