import { cache } from "react";
import { QueryCache, QueryClient } from "@tanstack/query-core";

const queryCache = new QueryCache({
  onError: (error) => {
    console.error("쿼리 에러 발생:", (error as Error).message);
  },
});

const getQueryClient = cache(
  () =>
    new QueryClient({
      queryCache,
      // mutationCache,
      defaultOptions: {
        queries: {
          //캐싱된 데이터를 60초 동안만 사용(유통기한)
          staleTime: 60 * 1000,
          gcTime: 15 * 60 * 1000, // 15분
          retry: 3,
          retryDelay: (attemptIndex) =>
            Math.min(1000 * 2 ** attemptIndex, 5000),
          //throwOnError: true,
        },
      },
    })
);
export default getQueryClient;
