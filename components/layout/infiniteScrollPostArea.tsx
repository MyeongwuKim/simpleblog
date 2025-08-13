"use client";

import { useInfiniteScrollData } from "@/app/hooks/useInfiniteQuery";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CardItem } from "../ui/items/cardItem";
import { Post } from "@prisma/client";

interface InfiniteScrollPostAreaProps {
  queryKey: string[];
}
const getPostData = async (pageNumber: number) => {
  const url = `/api/post`;
  console.log(url);
  const result = await (await fetch(url, { cache: "no-store" })).json();
  return result;
};

export default function InfiniteScrollPostArea({
  queryKey,
}: InfiniteScrollPostAreaProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteScrollData<Post, number>({
    queryKey: ["posts"],
    queryFn: getPostData,
    initialPageParam: 0,
  });
  if (isLoading) {
    return <div>로딩중!</div>;
  }
  const flatData = data?.pages.flatMap((page) => page.data) ?? [];
  console.log(flatData);
  return (
    <div className=" grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-4 relative">
      {flatData.map((post, i) => (
        <div key={post.id} className="aspect-square floatBox">
          <CardItem {...post} />
        </div>
      ))}
    </div>
  );
}
