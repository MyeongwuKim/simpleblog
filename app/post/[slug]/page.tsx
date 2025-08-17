import { fetchPostIdBySlug } from "@/app/lib/fetchers/post";
import CommonPost from "@/components/layout/commonPost";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
} from "@tanstack/react-query";

// app/posts/[postId]/page.tsx
interface PageProps {
  params: { slug: string };
}

export default async function Post({ params }: PageProps) {
  const queryClient = new QueryClient();
  const { slug } = await params;

  await queryClient.prefetchQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPostIdBySlug(slug),
  });

  return (
    <div>
      <div className="w-[768px] mt-20 ml-auto mr-auto  h-full relative">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <CommonPost />
          {/* <div className="mt-20 flex gap-16 flex-col justify-center">
            <div className="text-2xl text-text1 text-center font-bold">
              관련있는 피드
            </div>
            <div className="min-h-[600px]"></div>
          </div> */}
        </HydrationBoundary>
      </div>
    </div>
  );
}
