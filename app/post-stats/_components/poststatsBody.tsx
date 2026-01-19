"use client";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "flowbite-react";

const fetchPostStats = async (postId: string) => {
  const baseUrl = process.env.NEXTAUTH_URL ?? ""; // undefined면 빈 문자열
  const url = `${baseUrl}/api/post/${postId}/view`;
  const res = await fetch(url, {
    cache: "no-store",
  });

  const jsonData = await res.json();

  if (!jsonData.ok) {
    throw new Error(`API 오류 (${jsonData.error})`);
  }

  return jsonData;
};
export default function PostStatsBody({ postId }: { postId: string }) {
  const {
    data: statsData,
    isLoading,
    isError,
  } = useQuery<QueryResponse<PostStatsType>>({
    queryKey: ["poststats", postId],
    queryFn: () => {
      return fetchPostStats(postId);
    },
    staleTime: 600 * 1000,
  });

  if (isLoading)
    return (
      <div className=" w-full flex items-center justify-center">
        <Spinner size="lg" color="info" />
      </div>
    );

  return (
    <div className="px-6  w-full">
      <div className="rounded-xl bg-background1 p-6 shadow-md  ">
        <ul className="space-y-3 text-2xl text-text2">
          <li className="flex justify-between">
            <span className="">전체</span>
            <span className="font-semibold">{statsData?.data.total}</span>
          </li>
          <li className="flex justify-between">
            <span className="">오늘</span>
            <span className="font-semibold">{statsData?.data.today}</span>
          </li>
          <li className="flex justify-between">
            <span className="">어제</span>
            <span className="font-semibold">{statsData?.data.yesterday}</span>
          </li>
        </ul>
      </div>

      {/* 구분선 */}
      <div className="my-10 border-t border-border1" />
    </div>
  );
}
