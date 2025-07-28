"use client";

import CommonPost from "@/components/layout/commonPost";
import TagItem from "@/components/ui/items/tagItem";
import ReactMD from "@/components/write/reactMD";

export default function Post() {
  return (
    <div>
      <div className="w-[768px] mt-20 ml-auto mr-auto  h-full relative">
        <CommonPost></CommonPost>
      </div>
    </div>
  );
}
