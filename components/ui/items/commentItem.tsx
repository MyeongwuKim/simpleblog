"use client";

import ReactMD from "@/components/write/reactMD";
import LabelButton from "../buttons/labelButton";

import { FaUser } from "react-icons/fa6";

export default function CommentItem() {
  return (
    <div className="w-full h-full">
      <div className="w-full h-[54px] flex justify-between">
        <div className="flex">
          <div className="rounded-full h-12 w-12 bg-text3  mr-4 flex items-center justify-center">
            <FaUser className="w-8 h-8 text-text2" />
          </div>
          <div className="flex flex-col">
            <span className="text-text1">김명우</span>
            <span className="text-text3">2025.12.12</span>
          </div>
        </div>
        <div className={`w-auto h-[40px] `}>
          <LabelButton
            color="cyan"
            className="underline"
            innerItem="삭제"
            onClickEvt={() => {}}
          />
        </div>
      </div>
      <div className="mt-8">
        <ReactMD
          doc={
            "asdasdasd\n asd\n asd\nas\ndas\ndas\nd\n # ㅁㄴㅇㄹ ㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇ"
          }
        />
      </div>
      <div className="border-border1 border-b-[1px] mt-8"></div>
    </div>
  );
}
