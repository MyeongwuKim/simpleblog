"use client";
import TagItem from "../ui/items/tagItem";
import ReactMD from "../write/reactMD";
import FooterItem from "../ui/items/postFooterItem";
import LabelButton from "../ui/buttons/labelButton";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Post, Tag } from "@prisma/client";
import { formateDate } from "@/app/hooks/useUtil";
import Slugger from "github-slugger";

import remarkParse from "remark-parse";
import { unified } from "unified";
import React, { useEffect, useRef, useState } from "react";
import PostSkeleton from "../ui/skeleton";
import { fetchPostContent } from "@/app/lib/fetchers/post";

export default function CommonPost() {
  const params = useParams();
  const slug = params.slug as string;
  const {
    data: result,
    isLoading,
    error,
  } = useQuery<QueryResponse<Post & { tag: Tag[] }>>({
    queryKey: ["post", slug],
    queryFn: () => fetchPostContent(slug),
  });
  const headRef = useRef<HTMLDivElement>(null);

  function extractHeadings(markdown: string) {
    const tree = unified().use(remarkParse).parse(markdown);
    const headings: { level: number; text: string; id: string }[] = [];
    const slugger = new Slugger();

    const visit = (node: any) => {
      if (node.type === "heading") {
        const text = node.children
          .filter((child: any) => child.type === "text")
          .map((child: any) => child.value)
          .join("");
        const id = slugger.slug(text);
        headings.push({ level: node.depth, text, id });
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    };

    visit(tree);
    return headings;
  }

  if (isLoading) {
    return <></>;
  }
  const { data, ok } = result as QueryResponse<Post & { tag: Tag[] }>;

  return (
    <div className="w-full h-full">
      <PostHead
        ref={headRef}
        title={data.title}
        tag={data.tag}
        createdAt={data.createdAt}
      />
      <PostSide headRef={headRef} headings={extractHeadings(data.content)} />
      <PostBody content={data.content} />
      <div className="w-full h-[1px] bg-text4 mt-20" />
      <PostFooter />
    </div>
  );
}

export function PostBody({ content }: { content: string }) {
  return (
    <div id="post-body" className=" mt-20">
      <ReactMD doc={content} />
    </div>
  );
}

interface HeadProps {
  title: string;
  tag: Tag[];
  createdAt: Date;
}
const PostHead = React.forwardRef<HTMLDivElement, HeadProps>(
  ({ tag, title, createdAt }, ref) => (
    <div id="post-head">
      <h1 ref={ref} className="font-bold text-5xl leading-[1.5] mb-8">
        {title}
      </h1>
      <div className="w-full flex justify-between mb-2 [&_span]:text-lg [&_span]:text-text3">
        <span>{formateDate(createdAt, "NOR")}</span>
        <div className="gap-2 flex">
          <span>수정</span>
          <span>삭제</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {tag.map((v, i) => (
          <TagItem key={i} text={v.body} />
        ))}
      </div>
    </div>
  )
);
function PostFooter() {
  return (
    <div className="mt-20">
      <div className="w-full flex justify-between flex-auto">
        {[1, 2].map((v, i) => {
          return <FooterItem key={i} dir={i} />;
        })}
      </div>
    </div>
  );
}

interface PostSide {
  headings: { level: number; text: string; id: string }[];
  headRef: React.RefObject<HTMLDivElement | null>;
}
function PostSide({ headings, headRef }: PostSide) {
  const sideRef = useRef<HTMLDivElement>(null);
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!headRef.current) return;
      const headBottom =
        headRef.current.getBoundingClientRect().bottom + window.scrollY;
      if (window.scrollY > headBottom) setIsFixed(true);
      else setIsFixed(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headRef]);

  const scrollToHeading = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    const offset = 40; // 고정 헤더 높이 등
    const targetY =
      target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  };
  return (
    <div
      ref={sideRef}
      className={`${
        headings.length <= 0 ? "hidden" : "relative mt-2  xl:block hidden"
      } `}
    >
      <div className="absolute left-full z-50">
        <div
          className={`${
            isFixed ? "fixed top-[112px]" : ""
          } w-[240px] ml-[3rem] h-auto bg-background5 p-4`}
        >
          <ul>
            {headings.map(({ level, text, id }, i) => {
              return (
                <li
                  key={i}
                  style={{ marginLeft: (level - 1) * 10 }}
                  className={`w-full h-auto   overflow-hidden ease-in duration-100 hover:scale-[1.05]`}
                >
                  <LabelButton
                    onClickEvt={() => scrollToHeading(id)}
                    style={{ textSize: "text-sm", color: "gray" }}
                    content={<span>{text}</span>}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
