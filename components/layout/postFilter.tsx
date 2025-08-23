"use client";
import { useQuery } from "@tanstack/react-query";

import TagItem from "../ui/items/tagItem";
import { Tag } from "@prisma/client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DropdownBox from "../ui/dropdown/dropdownBox";

const fetchTagList = async () => {
  const url = `/api/tag`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) throw new Error("데이터를 가져오지 못했습니다.");

  const jsonData = await res.json();

  return jsonData;
};
export default function Postfilter() {
  const route = useRouter();
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get("tag");
  const [dateType, setDateType] = useState(
    searchParams.get("datetype") ?? "all"
  );

  const {
    isLoading,
    isError,
    data: tagResult,
  } = useQuery<QueryResponse<(Tag & { _count: { posts: number } })[]>>({
    queryKey: ["tag"],
    queryFn: fetchTagList,
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;

    let startX = e.pageX - el.offsetLeft;
    let scrollLeft = el.scrollLeft;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const x = moveEvent.pageX - el.offsetLeft;
      const walk = x - startX;
      el.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    const paramValue = searchParams.get("datetype") ?? "all";
    if (paramValue !== dateType) {
      setDateType(paramValue);
    }
  }, [searchParams]);

  // state 변경 시 URL 업데이트
  const changeDateType = (value: string) => {
    setDateType(value);

    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("datetype");
    } else {
      params.set("datetype", value);
    }
    const queryString = params.toString();
    route.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const changeTagFilter = useCallback(
    (tagBody: string) => {
      const result = tagBody.replace(/\(\d+\)/, "");
      if (result === "전체") {
        route.push("/");
      } else {
        route.push(`/?tag=${result}`);
      }
    },
    [route]
  );

  return (
    <div className="w-full h-[45px] relative flex items-center gap-4 mb-4">
      <div className="w-[80px]">
        <DropdownBox
          value={dateType}
          clickEvt={changeDateType}
          items={[
            { content: "전체", value: "all" },
            { content: "일주일", value: "week" },
            { content: "한달", value: "month" },
            { content: "일년", value: "year" },
          ]}
        />
      </div>
      <div className="w-[calc(100%-100px)]">
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          className="  flex overflow-x-auto scrollbar-hide scroll-smooth gap-2"
        >
          {isLoading
            ? Array.from({ length: 8 }, (_, i) => (
                <Skeleton key={i} className="h-5 w-14" />
              ))
            : tagResult?.data.map((v, i) => (
                <div key={v.body} className="flex-none">
                  <TagItem
                    clickEvt={changeTagFilter}
                    mode="check"
                    isChecked={
                      v.body === selectedTag ||
                      (!selectedTag && v.body === "전체")
                    }
                    text={`${v.body}(${v._count.posts})`}
                  />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
