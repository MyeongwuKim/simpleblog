'use client'
import TagItem from "../ui/items/tagItem";
import ReactMD from "../write/reactMD";
import FooterItem from "../ui/items/postFooterItem";
import LabelButton from "../ui/buttons/labelButton";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CommonPost() {
  return (
    <div className="w-full h-full">
      <PostHead />

      <PostBody />
      <div className="w-full h-[1px] bg-text4 mt-20" />
      <PostFooter />
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
  const route = useRouter();
  return (
    <div id="post-head">
      <h1 className="font-bold text-5xl leading-[1.5] mb-8">안녕하세요 이건 제목입니다.</h1>
      <div className="w-full flex justify-between mb-2 [&_span]:text-lg [&_span]:text-text3">
        <span className=" ">2025.12.12 작성</span>
        <div className="gap-2 flex">
          <span>수정</span>
          <span>삭제</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <TagItem text="야호as"></TagItem>
      </div>
      <div className="relative mt-2">
        <div className="absolute left-full">
          <div className="w-[240px] ml-[5rem] h-auto bg-background5 p-4">
            <div className="w-full h-auto  overflow-hidden ease-in duration-100 hover:scale-[1.05]">
              <LabelButton
                style={{ textSize: "text-sm", color: "gray" }}
                content={<Link href={"#123"}>목차라인1</Link>}
              />
            </div>
            <div className="w-full h-auto ml-[12px] overflow-hidden ease-in duration-100 hover:scale-[1.05]">
              <LabelButton
                style={{ textSize: "text-sm", color: "gray" }}
                content={<Link href={"#123"}>1.야호호호</Link>}
              />
            </div>
            <div className="w-full h-auto ml-[24px] overflow-hidden ease-in duration-100 hover:scale-[1.05]">
              <LabelButton style={{ textSize: "text-sm", color: "gray" }} content={<Link href={"#123"}>test?</Link>} />
            </div>
          </div>
        </div>
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
  
