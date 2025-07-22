
"use client";

import { Card } from "flowbite-react";
import Image from "next/image";
import { FaInstagramSquare, FaGithub } from "react-icons/fa";

export function ProfileItem() {
  return (
    <Card 
    imgSrc="/testImage.png" horizontal>
  <div className="flex flex-auto flex-col w-full h-full">
  <p className="font-normal text-text2">
      안녕하세요..
    </p>
  </div>
  <div className="bottom-[24px] flex w-full absolute gap-2"> 
        <FaInstagramSquare className="h-[36px] w-[36px]"></FaInstagramSquare>
        <FaGithub className="h-[36px] w-[36px]"></FaGithub>
    </div>
  </Card>
  );
}
