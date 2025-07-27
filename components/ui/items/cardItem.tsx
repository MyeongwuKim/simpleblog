"use client";

import { Card } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
export function CardItem() {
  return (
    <Link href={"/post/123"} className="w-full h-full relative flex flex-col">
      <Card
        theme={{
          root: {
            base: "border-0",
            children:
              "flex h-full flex-col justify-center gap-2 p-2 bg-background1",
          },
        }}
        className="w-full h-full"
        renderImage={() => (
          <div className="relative w-full h-full">
            ,
            <Image objectFit="cover" fill src="/testImage.png" alt="image 1" />
          </div>
        )}
      >
        <div id="CardItemWrapper" className="flex flex-col flex-auto gap-1">
          <h4
            className="text-[1rem] text-box
    font-bold tracking-tight text-gray-900 dark:text-white"
          >
            안녕하세요 여기는 제목입니다 제목입니다!
          </h4>
          <p className="line-clamp-3 text-text2 leading-[1.5em]">
            여기는 컨텐츠입니다! 여기는 컨텐츠입니다! 여기는 컨텐츠입니다!
            여기는 컨텐츠입니다! 여기는 컨텐츠입니다! 여기는 컨텐츠입니다!
            여기는 컨텐츠입니다! 여기는 컨텐츠입니다!
          </p>
        </div>
        <div className="text-text3">2052.12.12</div>
      </Card>
    </Link>
  );
}
