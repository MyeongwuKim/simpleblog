"use client";

import { formatRelativeTime, getDeliveryDomain } from "@/app/hooks/useUtil";
import { Collection } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiFolder } from "react-icons/fi";

function CollectionCardItem({
  updatedAt,
  slug,
  title,
  thumbnail,
  _count: { posts },
}: Collection & { _count: { posts: number } }) {
  return (
    <div className="w-full h-[280px] relative flex flex-col bg-transparent">
      <div className="flex h-full flex-col justify-center bg-transparent">
        <Link
          className="relative bg-background2 w-full h-full flex justify-center items-center"
          href={`/collections/${slug}`}
        >
          {thumbnail ? (
            <Image
              fill
              src={getDeliveryDomain(thumbnail, "public")}
              alt={title}
              priority
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
          ) : (
            <FiFolder className="w-14 h-14 text-text3" />
          )}
        </Link>

        <div className="mt-4 gap-2 flex flex-col">
          <Link
            href={`/collections/${slug}`}
            className="line-clamp-1 text-text1 leading-[1.5em] text-base"
          >
            <h4 className="">{title}</h4>
          </Link>
          <div className="flex gap-2 text-sm">
            <span className="text-text1">{posts}개의 포스트</span>
            <span className="text-text3">
              업데이트 {formatRelativeTime(updatedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(CollectionCardItem);
