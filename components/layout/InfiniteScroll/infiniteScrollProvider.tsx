"use client";

import { useInfiniteScrollData } from "@/app/hooks/useInfiniteQuery";
import { fetchPosts, fetchTempPosts } from "@/app/lib/fetchers/post";
import { CardItem } from "@/components/ui/items/cardItem";
import TempItem from "@/components/ui/items/tempItem";
import { CardItemSkeleton, TempItemSkeleton } from "@/components/ui/skeleton";
import { Post } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

// 타입 정의
type DataType = "post" | "temp";
type FetcherType = (
  page: number,
  params: { tag?: string; datetype?: string }
) => Promise<any>;

interface Page<T = any> {
  ok: boolean;
  data: T[];
  error?: string; // 실패 시만 존재
}
interface InfiniteScrollProviderProps {
  queryKey: readonly unknown[];
  type: DataType;
  pageSize?: number; // skeleton 갯수
}

interface RendererMap {
  layout: string;
  fetcher: (
    pageParam: number,
    params: { tag?: string; datetype?: string }
  ) => Promise<any>;
  renderContent: (item: any) => React.ReactNode;
  renderSkeleton: (i: number) => React.ReactNode;
}

const rendererMap: Record<DataType, RendererMap> = {
  post: {
    layout:
      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
    fetcher: fetchPosts,
    renderContent: (item: Post) => (
      <div key={item.id} className="h-[300px] floatBox">
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
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useInfiniteScrollData({
    queryKey,
    queryFn: (page) => {
      const [, params] = queryKey as [
        string,
        { tag?: string; datetype?: string }?
      ];
      return rendererMap[type].fetcher(page ?? 0, params ?? {});
    },

    initialPageParam: 0,
  });
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const hasBodyOverflow = () => {
    if (typeof window === "undefined") return false;
    return document.documentElement.scrollHeight > window.innerHeight;
  };

  useEffect(() => {
    if (!inView) return;

    if (isLoading || isFetchingNextPage) return;
    if (!hasNextPage) return;

    // 오버플로우 없으면 스킵
    if (!hasBodyOverflow()) return;

    fetchNextPage();
  }, [inView, isLoading, isFetchingNextPage, hasNextPage]);

  const flatData = data?.pages.flatMap((page) => page.data) ?? [];
  const pageErrors: Page[] =
    data?.pages.filter((page) => page.ok === false) ?? [];

  const failedPages = data?.pages
    .map((page, index) => (!page.ok ? index : null))
    .filter((i) => i !== null) as number[];

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div ref={containerRef} className="relative">
      <div className={rendererMap[type].layout}>
        {isLoading
          ? Array.from({ length: pageSize }).map((_, i) =>
              rendererMap[type].renderSkeleton(i)
            )
          : flatData.map(rendererMap[type].renderContent)}

        {/* sentinel 항상 리스트 끝에 위치 */}
        {flatData.length > 0 && <div ref={ref} className="h-10 w-full" />}
      </div>

      {isFetchingNextPage && (
        <div className={rendererMap[type].layout}>
          {Array.from({ length: pageSize }).map((_, i) =>
            rendererMap[type].renderSkeleton(i)
          )}
        </div>
      )}
      {!isFetchingNextPage && pageErrors.length > 0 && (
        <div className="text-red-500 mt-4 text-center">
          <div>{pageErrors[0].error} 😢</div>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded mt-2"
            onClick={() => {
              queryClient.setQueryData([type], (oldData: any) => ({
                ...oldData,
                pages: oldData.pages.filter(
                  (_: any, index: number) => index !== failedPages[0]
                ),
              }));
            }}
          >
            다시 시도
          </button>
        </div>
      )}
    </div>
  );
}
