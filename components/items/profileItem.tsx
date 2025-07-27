"use client";

import { Card, createTheme } from "flowbite-react";
import Image from "next/image";
import { FaGithub, FaInstagram } from "react-icons/fa6";

const mainTheme = createTheme({
  card: {
    root: {
      base: "flex rounded-lg border-0 bg-background1 shadow-md",
      children: "flex h-full flex-col justify-center gap-4 p-6",
    },
  },
});

export function ProfileItem() {
  return (
    <Card
      clearTheme={{ root: true }}
      theme={mainTheme.card}
      className="relative w-full h-full"
      imgSrc="/testImage.png"
      horizontal
    >
      <div className="grid grid-rows-[auto_auto_40px]  w-full h-full gap-2">
        <div className="font-bold text-3xl">김명우</div>
        <p className="font-normal text-text3">
          안녕하세요.. 안녕하세요.. 안녕하세요..안녕하세요.. 안녕하세요.. s
          안녕하세요..안녕하세요.. 안녕하세요.. 안녕하세요..asdasd 안녕하세요..
          안녕하세요.. 안녕하세요..안녕하세요.. 안녕하세요.. s
          안녕하세요..안녕하세요.. 안녕하세요.. 안녕하세요..asdasdaa
        </p>
        <div className="flex w-full gap-2">
          <FaInstagram className="h-[36px] w-[36px] text-text1"></FaInstagram>
          <FaGithub className="h-[36px] w-[36px] text-text1"></FaGithub>
        </div>
      </div>
    </Card>
  );
}
