import { cache } from "react";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/query-core";

const mutationCache = new MutationCache({
  onError: (error, variables, context, mutation) => {
    console.error("에러 메시지:", error.message); // "아오 실패다!!"
  },
});

const queryCache = new QueryCache({
  onError: (error, query) => {
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
          retry: 1,
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          //throwOnError: true,
        },
      },
    })
);
export default getQueryClient;
