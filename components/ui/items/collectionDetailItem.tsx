import { formatRelativeTime, getDeliveryDomain } from "@/app/hooks/useUtil";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdImageNotSupported } from "react-icons/md";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DetailItemProps {
  isModify: boolean;
  order: number;
  detailData: CollectionItemType;
  id: string;
}
function CollectionDetailItem({
  isModify,
  detailData,
  order,
  id,
}: DetailItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hasThumb = !!detailData.thumbnail;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isModify ? listeners : {})}
      className={isModify ? "cursor-grab" : ""}
    >
      <article
        className={`
          flex flex-col gap-3
          sm:flex-row sm:gap-5
          ${isModify && "pointer-events-none select-none"}
        `}
      >
        {/* 미디어 영역 */}
        <Link
          href={`/post/${detailData.slug}`}
          className={`
            relative overflow-hidden bg-background2
            w-full aspect-[16/9]
            sm:w-[192px] sm:aspect-[4/3]
            shrink-0 rounded-md
            ${!hasThumb && "max-sm:hidden"}
          `}
        >
          {hasThumb ? (
            <Image
              fill
              src={getDeliveryDomain(detailData.thumbnail!, "thumbnail")}
              alt="thumb"
              sizes="(max-width: 768px) 100vw, 192px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-text3">
              <MdImageNotSupported className="h-14 w-14" />
            </div>
          )}
        </Link>

        {/* 텍스트 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-text2">
            <span className="after:content-['.']  mr-2">{order + 1}</span>
            <Link className="hover:underline" href={`/post/${detailData.slug}`}>
              {detailData.title}
            </Link>
          </h2>

          {detailData.preview && (
            <p className="line-clamp-2 text-text2 leading-[1.5em]">
              {detailData.preview}
            </p>
          )}

          <div className="text-text3 text-sm mt-auto">
            {formatRelativeTime(detailData.createdAt)}
          </div>
        </div>
      </article>
    </div>
  );
}

export default React.memo(CollectionDetailItem);
