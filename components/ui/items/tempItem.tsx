"use client";
import { Post } from "@prisma/client";
import LabelButton from "../buttons/labelButton";
import { formateDate } from "@/app/hooks/useUtil";
import Link from "next/link";

export default function TempItem({ preview, title, updatedAt, slug }: Post) {
  return (
    <div className="w-full h-full  flex flex-col py-4 gap-4 border-b border-border1">
      <Link href={`/write?slug=${slug}`}>
        <h3 className="text-text1 font-bold text-2xl">{title}</h3>
      </Link>
      <Link href={`/write?slug=${slug}`}>
        <p className="line-clamp-3 text-text2 leading-[1.5em]">{preview}</p>
      </Link>
      <div className="text-text3 flex justify-between">
        <span>{formateDate(updatedAt, "NOR")}</span>
        <div className={`w-auto h-[40px] `}>
          <LabelButton
            style={{ textSize: "text-md", color: "cyan", underline: true }}
            content="삭제"
            onClickEvt={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
