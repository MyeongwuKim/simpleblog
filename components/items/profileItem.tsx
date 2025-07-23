
"use client";

import { Card,createTheme } from "flowbite-react";
import Image from "next/image";
import { FaInstagramSquare, FaGithub } from "react-icons/fa";


const mainTheme = createTheme({
 card:{
  root:{
    base:"flex rounded-lg border-0 bg-background1 shadow-md",
    children:"flex h-full flex-col justify-center gap-4 p-6"
  }
 }
});

export function ProfileItem() {
  return (
    <Card
    clearTheme={{root:true}}
      theme={mainTheme.card}
      className="relative w-full h-full"
      imgSrc="/testImage.png"
      horizontal
    >
      <div className="flex flex-auto flex-col w-full h-full">
        <p className="font-normal text-text2">안녕하세요..</p>
      </div>
      <div className="bottom-[24px] flex w-full absolute gap-2">
        <FaInstagramSquare className="h-[36px] w-[36px]"></FaInstagramSquare>
        <FaGithub className="h-[36px] w-[36px]"></FaGithub>
      </div>
    </Card>
  );
}
