"use client";

import { Card, createTheme } from "flowbite-react";
import { FaGithub, FaInstagram } from "react-icons/fa6";

const mainTheme = createTheme({
  card: {
    root: {
      base: "flex rounded-lg border-0 bg-background1 shadow-md max-sm:items-center",
      children: "p-4",
      horizontal: {
        off: "flex-col",
        on: "max-sm:flex-col  flex-row",
      },
      href: "hover:bg-gray-100 dark:hover:bg-gray-700",
    },
    img: {
      base: "",
      horizontal: {
        off: "",
        on: "h-96 w-full rounded-t-lg object-contain max-sm:h-auto max-sm:w-48 max-sm:rounded-none rounded-l-lg max-sm:mt-4 ",
      },
    },
  },
});

export function ProfileItem() {
  return (
    <Card
      clearTheme={{ root: true, img: true }}
      theme={mainTheme.card}
      className="w-full"
      imgSrc="/testImage.png"
      horizontal
    >
      <div className="grid grid-rows-[auto_auto_40px]   w-full h-full gap-4">
        <div className="font-bold text-3xl">김명우asdasdasdasd</div>
        <p className="font-normal text-text3">
          안녕하세요.. 안녕하세요.. 안녕하세요..안녕하세요.. 안녕하세요.. s 안녕하세요..안녕하세요.. 안녕하세요..
          안녕하세요..asdasd 안녕하세요.. 안녕하세요.. 안녕하세요..안녕하세요.. 안녕하세요.. s 안녕하세요..안녕하세요..
          안녕하세요.. 안녕하세요..asdasdaa
        </p>
        <div className="flex w-full gap-2">
          <FaInstagram className="h-[36px] w-[36px] text-text1"></FaInstagram>
          <FaGithub className="h-[36px] w-[36px] text-text1"></FaGithub>
        </div>
      </div>
    </Card>
  );
}
