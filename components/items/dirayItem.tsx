"use client";
import ReactMD from "../write/reactMD";

export default function Diaryitem() {
  return (
    <div className="w-full h-ful">
      <PostHead></PostHead>
      <PostBody></PostBody>
      <div className="w-full h-[1px] bg-text4 mt-20" />
    </div>
  );
}

export function PostBody() {
  return (
    <div id="post-body" className=" mt-8">
      <ReactMD
        doc={`# 이건 일기장입니다...간단하게 써요
            ㄹㅇ루 간단하게 코멘트 몇개..
        `}
      />
    </div>
  );
}
export function PostHead() {
  return (
    <div id="post-head">
      <h1 className="text-3xl leading-[1.5] mb-4">
        안녕하세요 이건 제목입니다.
      </h1>
      <div className="w-full flex justify-between mb-2 [&_span]:text-lg [&_span]:text-text3">
        <span className="text-3xl">2025.12.12 작성</span>
        <div className="gap-2 flex">
          <span>삭제</span>
        </div>
      </div>
      <div></div>
    </div>
  );
}
