"use client";

import { formatRelativeTime, getDeliveryDomain } from "@/app/hooks/useUtil";
import { Post } from "@prisma/client";
import { Card } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdImageNotSupported } from "react-icons/md";

function PostCardItem({ createdAt, preview, thumbnail, title, slug }: Post) {
  return (
    <Link
      href={`/post/${slug}`}
      className="w-full h-[300px] floatBox relative flex flex-col"
    >
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
          <div className="relative bg-background2 w-full h-[240px] flex justify-center items-center">
            {thumbnail ? (
              <Image
                fill
                src={getDeliveryDomain(thumbnail, "public")}
                alt={title}
                priority
                className="object-cover"
              />
            ) : (
              <MdImageNotSupported className="w-14 h-14" />
            )}
          </div>
        )}
      >
        <div id="CardItemWrapper" className="flex flex-col flex-auto gap-1">
          <h4
            className="text-[1rem] text-box
    font-bold tracking-tight text-gray-900 dark:text-white"
          >
            {title}
          </h4>
          <p className="line-clamp-2 text-text2 leading-[1.5em]">{preview}</p>
        </div>
        <div className="text-text3">{formatRelativeTime(createdAt)}</div>
      </Card>
    </Link>
  );
}

export default React.memo(PostCardItem);
