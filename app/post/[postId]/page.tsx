import CommonPost from "@/components/layout/commonPost";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

// app/posts/[postId]/page.tsx
interface PageProps {
  params: { postId: string };
}

const getPostData = async (postId: string) => {
  const url = `/api/post/${postId}`;
  const result = await (await fetch(url, { cache: "no-store" })).json();
  return result;
};
const getPostDataWithKey = ({ queryKey }: { queryKey: [string, string] }) => {
  const [_key, postId] = queryKey;
  return getPostData(postId);
};

export default async function Post({ params }: PageProps) {
  const queryClient = new QueryClient();
  const { postId } = await params;
  const data = await queryClient.prefetchQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostData(postId),
  });

  return (
    <div>
      <div className="w-[768px] mt-20 ml-auto mr-auto  h-full relative">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <CommonPost />
        </HydrationBoundary>
      </div>
    </div>
  );
}
