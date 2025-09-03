import InfiniteScrollProvider from "@/components/layout/InfiniteScroll/infiniteScrollProvider";
import { redirect } from "next/navigation";
import { db } from "./lib/db";

interface SearchParams {
  searchParams: {
    tag?: string;
    datetype?: string;
  };
}
const VALID_DATE_TYPES = ["year", "month", "week"];

export default async function Home({ searchParams }: SearchParams) {
  // const queryClient = getQueryClient();

  const { tag, datetype } = await searchParams;

  if (datetype && !VALID_DATE_TYPES.includes(datetype)) {
    return redirect("/");
  }
  if (tag) {
    const exist = await db.tag.findUnique({ where: { body: tag } });
    if (!exist) {
      return redirect("/"); // 잘못된 태그면 전체로 보냄
    }
  }

  const queryKey =
    !tag && !datetype
      ? ["post"]
      : ["post", { ...(tag && { tag }), ...(datetype && { datetype }) }];

  // await queryClient.prefetchInfiniteQuery<
  //   InfiniteResponse<Post>,
  //   Error,
  //   InfiniteData<InfiniteResponse<Post>>,
  //   typeof queryKey,
  //   string | null // ✅ string도 가능하게
  // >({
  //   queryKey,
  //   queryFn: ({ pageParam, queryKey }) => {
  //     const [, params] = queryKey as [
  //       string,
  //       { tag?: string; datetype?: string }
  //     ];
  //     return fetchPosts(pageParam ?? undefined, params ?? {});
  //   },
  //   initialPageParam: null,
  //   getNextPageParam: (lastPage: InfiniteResponse<Post>) =>
  //     lastPage.nextCursor ?? undefined,
  // });

  return (
    <InfiniteScrollProvider
      refetchOnMount="always"
      queryKey={queryKey}
      type="post"
    />
  );
}
