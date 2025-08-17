"use client";

import { useInfiniteScrollData } from "@/app/hooks/useInfiniteQuery";
import { fetchPosts, fetchTempPosts } from "@/app/lib/fetchers/post";
import { CardItem } from "@/components/ui/items/cardItem";
import TempItem from "@/components/ui/items/tempItem";
import { CardItemSkeleton, TempItemSkeleton } from "@/components/ui/skeleton";
import { Post } from "@prisma/client";

// 타입 정의
type DataType = "post" | "temp";

interface InfiniteScrollProviderProps {
  queryKey: string[];
  type: DataType;
  pageSize?: number; // skeleton 갯수
}

interface RendererMap {
  layout: string;
  fetcher: (pageParam: number) => Promise<any>;
  renderContent: (item: any) => React.ReactNode;
  renderSkeleton: (i: number) => React.ReactNode;
}

const rendererMap: Record<DataType, RendererMap> = {
  post: {
    layout:
      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
    fetcher: fetchPosts,
    renderContent: (item: Post) => (
      <div key={item.id} className="h-[300px]">
        <CardItem {...item} />
      </div>
    ),
    renderSkeleton: (i) => (
      <div className="h-[300px]" key={i}>
        <CardItemSkeleton />
      </div>
    ),
  },
  temp: {
    layout: "flex flex-wrap flex-col gap-4",
    fetcher: fetchTempPosts,
    renderContent: (item: any) => (
      <div key={item.id} className="h-[170px]">
        <TempItem {...item} />
      </div>
    ),
    renderSkeleton: (i) => (
      <div key={i} className="h-[170px]">
        <TempItemSkeleton />
      </div>
    ),
  },
};

export default function InfiniteScrollProvider({
  queryKey,
  type,
  pageSize = 12,
}: InfiniteScrollProviderProps) {
  const { data, isLoading } = useInfiniteScrollData({
    queryKey,
    queryFn: rendererMap[type].fetcher,
    initialPageParam: 0,
  });

  const flatData = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <>
      <div className={rendererMap[type].layout}>
        {isLoading
          ? Array.from({ length: pageSize }).map((_, i) =>
              rendererMap[type].renderSkeleton(i)
            )
          : flatData.map(rendererMap[type].renderContent)}
      </div>
    </>
  );
}
