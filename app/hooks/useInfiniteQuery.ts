import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  InfiniteData,
  QueryKey,
} from "@tanstack/react-query";

export interface ApiResponse<T> {
  ok: boolean;
  data: T[];
  totalCount?: number;
}

interface UseInfiniteScrollDataProps<TPageData, TPageParam, TError = unknown> {
  queryKey: QueryKey;
  queryFn: (
    pageParam: TPageParam,
    queryKey: QueryKey
  ) => Promise<ApiResponse<TPageData>>;
  gcTime?: number;
  staleTime?: number;
  initialPageParam: TPageParam;
  getNextPageParam?: (
    lastPage: ApiResponse<TPageData>,
    pages: ApiResponse<TPageData>[]
  ) => TPageParam | undefined;
}

export function useInfiniteScrollData<
  TPageData,
  TPageParam = number,
  TError = unknown
>(
  props: UseInfiniteScrollDataProps<TPageData, TPageParam, TError>
): UseInfiniteQueryResult<InfiniteData<ApiResponse<TPageData>>, TError> {
  const {
    queryKey,
    queryFn,
    gcTime,
    staleTime,
    initialPageParam,
    getNextPageParam,
  } = props;

  return useInfiniteQuery<
    ApiResponse<TPageData>,
    TError,
    InfiniteData<ApiResponse<TPageData>>,
    QueryKey
  >({
    queryKey,
    queryFn: ({ pageParam, queryKey }) =>
      queryFn((pageParam ?? initialPageParam) as TPageParam, queryKey),
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.ok || lastPage.data.length === 0) return undefined;
      const loadedCount = pages.reduce(
        (acc, page) => acc + page.data.length,
        0
      );
      const totalCount = lastPage.totalCount ?? 0;
      return loadedCount < totalCount ? pages.length : undefined;
    },
    initialPageParam,
    staleTime,
    gcTime,
  });
}
