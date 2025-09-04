"use client";
import { Card } from "flowbite-react";

export function Skeleton({ className = "", rounded = "rounded-md" }) {
  return (
    <div className={`animate-pulse bg-background4 ${rounded} ${className}`} />
  );
}
export function CardItemSkeleton() {
  return (
    <Card
      theme={{
        root: {
          base: "border-0",
          children:
            "flex h-full w-full flex-col justify-center gap-2 p-2 bg-background1",
        },
      }}
      className="w-full h-full"
      renderImage={() => (
        <div className="relative w-full h-full flex justify-center items-center">
          <Skeleton className="w-full h-[200px] rounded-none" />
        </div>
      )}
    >
      <div id="CardItemWrapper" className="flex flex-col flex-auto gap-2">
        <Skeleton className="w-2/3 h-4" />
        <div className="flex gap-2 flex-col">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-1/3 h-4" />
        </div>
      </div>
      <div className="text-text3">
        <Skeleton className="w-1/4 h-4" />
      </div>
    </Card>
  );
}

export default function PostSkeleton() {
  return (
    <div className="w-full h-full">
      {/* Post Head */}
      <div id="post-head">
        <Skeleton className="w-3/4 h-10 mb-6" rounded="rounded-md" />
        <div className="w-full flex justify-between mb-4">
          <Skeleton className="w-24 h-5" />
          <div className="flex gap-2">
            <Skeleton className="w-10 h-5" />
            <Skeleton className="w-10 h-5" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-16 h-6" rounded="rounded-full" />
          ))}
        </div>
      </div>

      {/* Post Side (목차 자리) */}
      <div className="absolute left-full hidden xl:block ml-[3rem]">
        <div className="w-[240px] bg-background5 p-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              className="w-full h-5 mb-3"
              rounded="rounded-sm"
            />
          ))}
        </div>
      </div>

      {/* Post Body */}
      <div id="post-body" className="mt-20 space-y-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton
            key={i}
            className={`${i % 3 === 0 ? "w-full" : "w-5/6"} h-5`}
            rounded="rounded-sm"
          />
        ))}
      </div>

      {/* Footer */}
      <div className="w-full h-[1px] bg-text4 mt-20" />
      <div className="mt-20 flex justify-between">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="w-1/3">
            <Skeleton className="w-full h-6 mb-2" />
            <Skeleton className="w-2/3 h-5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export const TempItemSkeleton = () => {
  return (
    <div className="w-full h-full  flex flex-col py-4 gap-4 border-b border-border1">
      <Skeleton className="w-1/3 h-5"></Skeleton>
      <Skeleton className="w-2/3 h-5"></Skeleton>

      <Skeleton className="w-1/4 h-3"></Skeleton>
    </div>
  );
};

export const TagItemSkeleton = () => {
  return (
    <div className="w-full h-full  flex flex-col py-4 gap-4 border-b border-border1">
      <Skeleton className="w-1/3 h-5"></Skeleton>
      <Skeleton className="w-2/3 h-5"></Skeleton>

      <Skeleton className="w-1/4 h-3"></Skeleton>
    </div>
  );
};

export const SettingSkeleton = () => {
  return (
    <div className="flex gap-6 flex-col">
      <div className="w-full h-full flex flex-row flex-auto max-sm:flex-col sm:mb-10">
        <div className="flex flex-col items-center pr-8">
          <Skeleton className="w-[128px] h-[192px] rounded-md relative mb-4 overflow-hidden flex items-center justify-center"></Skeleton>
        </div>

        <div className="border-r-[1px] border-border1 max-sm:border-b-[1px] max-sm:mt-6 max-sm:mb-6" />
        <div className="sm:px-8 flex flex-auto flex-col gap-2">
          <Skeleton className="w-1/4 h-[20px]"></Skeleton>
          <Skeleton className="w-2/3 h-[20px]"></Skeleton>
        </div>
      </div>
      <div className="w-full h-auto">
        <div className="w-full h-auto relative pb-6 flex border-b-[1px] border-border1">
          <div className="max-w-[163px] w-full">
            <h3 className="text-text1 text-xl font-bold w-full">소셜설정</h3>
          </div>
          <div
            id="sub-setting-view"
            className="flex relative w-full gap-2 justify-items-stretch"
          >
            <div className="w-full flex flex-col gap-2">
              <Skeleton className="w-1/3 h-[20px]"></Skeleton>
              <Skeleton className="w-2/3 h-[20px]"></Skeleton>
              <Skeleton className="w-1/4 h-[20px]"></Skeleton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
