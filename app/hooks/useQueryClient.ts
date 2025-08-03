import { cache } from "react";
import { QueryClient } from "@tanstack/query-core";

const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          // With SSR, we usually want to set some default staleTime
          // above 0 to avoid refetching immediately on the client
          //캐싱된 데이터를 60초 동안만 사용(유통기한)
          staleTime: 60 * 1000,
          retry: 1,
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          throwOnError: true,
        },
      },
    })
);
export default getQueryClient;
