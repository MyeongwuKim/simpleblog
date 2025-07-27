"use client";
import { useSelector, useDispatch } from "react-redux";
import {
  increment,
  decrement,
  incrementByAmount,
} from "@/redux/reducer/changeView";
import TagItem from "@/components/items/tagItem";
import ReactMD from "@/components/write/reactMD";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

export default function Post() {
  const count = useSelector((state: any) => state.counter.value);

  return (
    <div>
      <div className="w-[768px] mt-20 ml-auto mr-auto  h-full relative">
        <PostHead />
        <PostBody />
        <div className="w-full h-[1px] bg-text4 mt-20" />
        <PostFooter></PostFooter>
      </div>
    </div>
  );
}

export function PostBody() {
  return (
    <div id="post-body" className=" mt-20">
      <ReactMD
        doc={`# 안녕하세요!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11
        > 안녕히 가세요!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
         아야ㅏ아아ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ
         ㄴㅁ암낭ㅁㄴ암ㄴ암ㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇ
         안녕히 가세요!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
         아야ㅏ아아ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ
         ㄴㅁ암낭ㅁㄴ암ㄴ암ㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇ
         안녕히 가세요!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
         아야ㅏ아아ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ
         ㄴㅁ암낭ㅁㄴ암ㄴ암ㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇ
         안녕히 가세요!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
         아야ㅏ아아ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ
         ㄴㅁ암낭ㅁㄴ암ㄴ암ㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇ
         안녕히 가세요!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
         아야ㅏ아아ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ
         ㄴㅁ암낭ㅁㄴ암ㄴ암ㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇ
         안녕히 가세요!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
         아야ㅏ아아ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ
         ㄴㅁ암낭ㅁㄴ암ㄴ암ㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇ
         안녕히 가세요!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
         아야ㅏ아아ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ
         ㄴㅁ암낭ㅁㄴ암ㄴ암ㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇ
         안녕히 가세요!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
         아야ㅏ아아ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ
         ㄴㅁ암낭ㅁㄴ암ㄴ암ㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇ
         
        `}
      />
    </div>
  );
}
export function PostHead() {
  return (
    <div id="post-head">
      <h1 className="text-5xl leading-[1.5] mb-8">
        안녕하세요 이건 제목입니다.
      </h1>
      <div className="w-full flex justify-between mb-2 [&_span]:text-lg [&_span]:text-text3">
        <span className=" ">2025.12.12 작성</span>
        <div className="gap-2 flex">
          <span>수정</span>
          <span>삭제</span>
        </div>
      </div>
      <div>
        <TagItem text="야호asdasdasdasdasdasdasdasd sdasdasd"></TagItem>
      </div>
    </div>
  );
}

function PostFooter() {
  return (
    <div className="mt-20">
      <div className="w-full flex justify-between flex-auto">
        {[1, 2].map((v, i) => {
          return <FooterItem key={i} dir={i} />;
        })}
      </div>
    </div>
  );
}

type FooterItemType = {
  dir: number;
};
function FooterItem({ dir }: FooterItemType) {
  return (
    <div
      className={`w-[360px] h-[64px] cursor-pointer bg-background5 rounded-md flex px-4 py-1.5 i
    tems-center justify-center ${
      dir ? "right-moveBox flex-row-reverse" : "left-moveBox"
    }`}
    >
      <div
        className={`w-auto h-auto flex items-center ${dir ? "pl-4" : "pr-4"}`}
      >
        {dir ? (
          <FaArrowAltCircleRight className="w-8 h-8 text-text4" />
        ) : (
          <FaArrowAltCircleLeft className="w-8 h-8 text-text4" />
        )}
      </div>
      <div className="w-full h-full">
        <div
          className={`text-text3 text-sm ${dir ? "text-right" : "text-left"}`}
        >
          {dir ? "다음 포스트" : "이전 포스트"}
        </div>
        <div className="line-clamp-1">
          ㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㄹㅁㄴㅇㄹ
        </div>
      </div>
    </div>
  );
}
