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
import { useEffect } from "react";

const getPostData = async (postId: string) => {
  const url = `/api/post/${postId}`;
  const result = await (await fetch(url, { cache: "no-store" })).json();
  return result;
};

export default function CommonPost() {
  const params = useParams();
  const postId = params.postId as string;
  const {
    data: result,
    isLoading,
    error,
  } = useQuery<QueryResponse<Post & { tag: Tag[] }>>({
    queryKey: ["post", postId],
    queryFn: () => getPostData(postId),
  });
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
    return <div>로딩중..</div>;
  }
  const { data, ok } = result as QueryResponse<Post & { tag: Tag[] }>;

  return (
    <div className="w-full h-full">
      <PostHead
        title={data.title}
        tag={data.tag}
        createdAt={data.createdAt}
        headings={extractHeadings(data.content)}
      />
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
  headings: { level: number; text: string; id: string }[];
}
export function PostHead({ tag, title, createdAt, headings }: HeadProps) {
  return (
    <div id="post-head">
      <h1 className="font-bold text-5xl leading-[1.5] mb-8">{title}</h1>
      <div className="w-full flex justify-between mb-2 [&_span]:text-lg [&_span]:text-text3">
        <span className=" ">{formateDate(createdAt, "NOR")}</span>
        <div className="gap-2 flex">
          <span>수정</span>
          <span>삭제</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {tag.map((v, i) => (
          <div key={i}>
            <TagItem text={v.body} />
          </div>
        ))}
      </div>
      <div className="relative mt-2">
        <div className="absolute left-full">
          <div className="w-[240px] ml-[5rem] h-auto bg-background5 p-4">
            <ul>
              {headings.map(({ level, text, id }, i) => {
                return (
                  <li
                    key={i}
                    style={{ marginLeft: (level - 1) * 10 }}
                    className={`w-full h-auto   overflow-hidden ease-in duration-100 hover:scale-[1.05]`}
                  >
                    <LabelButton
                      style={{ textSize: "text-sm", color: "gray" }}
                      content={<Link href={`#${id}`}>{text}</Link>}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

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
