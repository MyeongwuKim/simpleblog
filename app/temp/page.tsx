import InfiniteScrollProvider from "@/components/layout/InfiniteScroll/infiniteScrollProvider";

export default async function Temp() {
  const queryKey = ["temp"];

  return (
    <div className="max-w-[768px]  w-full ml-auto mr-auto relative">
      <InfiniteScrollProvider staleTime={0} queryKey={queryKey} type="temp" />
    </div>
  );
}
