"use client";

import { fetchComments } from "@/app/lib/fetchers/comments";
import {
  FetchParams,
  fetchPosts,
  fetchRelatedPosts,
  fetchTempPosts,
} from "@/app/lib/fetchers/post";
import NoPostIcon from "@/components/ui/icon/noPostIcon";
import PostCardItem from "@/components/ui/items/postCardItem";

import CommentItem from "@/components/ui/items/commentItem";
import TempItem from "@/components/ui/items/tempItem";

import { CardItemSkeleton, TempItemSkeleton } from "@/components/ui/skeleton";
import { Comment, Post } from "@prisma/client";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

// 타입 정의
type DataType = "post" | "temp" | "comments" | "relatedPosts";

interface InfiniteScrollProviderProps {
  queryKey: readonly unknown[];
  type: DataType;
  pageSize?: number;
  gcTime?: number;
  staleTime?: number;
  refetchOnMount?: boolean | "always";
}

interface RendererMap<T = unknown> {
  layout: string;
  fetcher: (
    cursor: string | undefined,
    params: FetchParams
  ) => Promise<InfiniteResponse<T>>;
  renderContent: (item: T) => React.ReactNode;
  renderSkeleton: (i: number) => React.ReactNode;
}

type DataTypeMap = {
  post: Post;
  temp: Post;
  comments: Comment;
  relatedPosts: Post;
};

const rendererMap: {
  [K in keyof DataTypeMap]: RendererMap<DataTypeMap[K]>;
} = {
  post: {
    layout:
      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
    fetcher: fetchPosts,
    renderContent: (item: Post) => <PostCardItem key={item.id} {...item} />,
    renderSkeleton: (i) => (
      <div className="h-[300px]" key={i}>
        <CardItemSkeleton />
      </div>
    ),
  },
  temp: {
    layout: "flex flex-wrap flex-col gap-4",
    fetcher: fetchTempPosts,
    renderContent: (item: Post) => (
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
  comments: {
    layout: "flex flex-wrap flex-col gap-4",
    fetcher: fetchComments,
    renderContent: (item: Comment) => <CommentItem key={item.id} {...item} />,
    renderSkeleton: (i) => (
      <div key={i} className="h-[170px]">
        <TempItemSkeleton />
      </div>
    ),
  },
  relatedPosts: {
    layout:
      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
    fetcher: fetchRelatedPosts,
    renderContent: (item: Post) => (
      <div key={item.id} className="h-[300px] floatBox">
        <PostCardItem {...item} />
      </div>
    ),
    renderSkeleton: (i) => (
      <div className="h-[300px]" key={i}>
        <CardItemSkeleton />
      </div>
    ),
  },
};

export default function InfiniteScrollProvider<T extends DataType>({
  queryKey,
  type,
  pageSize = 12,
  gcTime = 1000 * 60 * 10,
  staleTime = 1000 * 30 * 5,
  refetchOnMount = true,
}: InfiniteScrollProviderProps & { type: T }) {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    refetch,
    isFetching,
  } = useInfiniteQuery<
    InfiniteResponse<DataTypeMap[T]>,
    Error,
    InfiniteData<InfiniteResponse<DataTypeMap[T]>>,
    typeof queryKey,
    string | undefined
  >({
    queryKey,
    gcTime,
    staleTime,
    initialPageParam: undefined,
    queryFn: ({ pageParam }) => {
      const [, params] = queryKey as [
        string,
        {
          tag?: string;
          tags?: string[];
          datetype?: string;
          excludeId?: string;
        }?
      ];
      return rendererMap[type].fetcher(pageParam, params ?? {});
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
    refetchOnMount,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({ threshold: 0.5 });

  const hasBodyOverflow = () => {
    if (typeof window === "undefined") return false;
    return document.documentElement.scrollHeight > window.innerHeight;
  };

  const getNoPostContent = () => {
    switch (type) {
      case "post":
        return "작성된 글이 없습니다.";
      case "temp":
        return "작성된 임시글이 없습니다.";
      case "comments":
        return "작성된 댓글이 없습니다.";
      default:
        return "관련된 글이 없습니다.";
    }
  };

  const flatData: DataTypeMap[T][] =
    data?.pages.flatMap((page) => page.data) ?? [];
  const pageErrors: InfiniteResponse<DataTypeMap[T]>[] =
    data?.pages.filter((page) => page.ok === false) ?? [];
  const failedPages = data?.pages
    .map((page, index) => (!page.ok ? index : null))
    .filter((i) => i !== null) as number[];

  useEffect(() => {
    if (!inView) return;
    if (isLoading || isFetchingNextPage) return;
    if (!hasNextPage) return;

    // 🚨 실패한 페이지가 있으면 자동 요청 중단
    if (pageErrors.length > 0) return;

    if (!hasBodyOverflow()) return;
    fetchNextPage();
  }, [inView, isLoading, isFetchingNextPage, hasNextPage, pageErrors]);

  return (
    <div ref={containerRef} className="relative">
      <div className={rendererMap[type].layout}>
        {isLoading ? (
          Array.from({ length: pageSize }).map((_, i) =>
            rendererMap[type].renderSkeleton(i)
          )
        ) : flatData.length > 0 ? (
          <>
            {flatData.map(rendererMap[type].renderContent)}
            <div ref={ref} className="h-10 w-full" />
          </>
        ) : (
          pageErrors.length <= 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 w-full">
              <NoPostIcon content={getNoPostContent()} />
            </div>
          )
        )}
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
            className="w-30 px-4 py-2 bg-red-500 text-white rounded mt-2"
            onClick={() => {
              if (failedPages[0] === 0) {
                refetch();
              } else {
                const failedCursor = pageErrors[0]?.nextCursor;
                if (failedCursor) {
                  fetchNextPage(); // ✅ v5 공식
                } else {
                  refetch();
                }
              }
            }}
          >
            {isFetching || isFetchingNextPage ? "불러오는 중..." : "다시 시도"}
          </button>
        </div>
      )}
    </div>
  );
}
