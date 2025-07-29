"use client";
import { NextPage } from "next";

import remarkGfm from "remark-gfm";
//  import  "github-markdown-css/github-markdown.css"; //<- github 스타일을 참조함
import ReactMarkDown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import Image from "next/image";
import RemarkCode from "@/app/lib/remark-code";
import { defaultSchema } from "rehype-sanitize";
import rehypeSanitize from "rehype-sanitize";
import { usePathname } from "next/navigation";
import React, { JSX } from "react";

interface IReactMD {
  doc: string;
}

const ReactMD: NextPage<IReactMD> = ({ doc }) => {
  const pathname = usePathname();
  const customSanitizedSchema = {
    ...defaultSchema, // 올바르게 가져온 defaultSchema 사용
    tagNames:
      pathname == "/comments"
        ? ["br"]
        : defaultSchema.tagNames.filter(
            (tag) =>
              // 여기서 허용하고 싶지 않은 태그들을 제외합니다.
              // 예: script, iframe, object, embed 등
              !["script", "iframe", "object", "embed", ""].includes(tag)
          ),
  };

  return (
    <>
      <ReactMarkDown
        components={{
          a({ node, children, ...props }) {
            return (
              <a className="mb-[1em]" target="_blank" {...props}>
                {children}
              </a>
            );
          },
          h1({ node, children, ...props }) {
            return (
              <h1 className="appendix font-sans mb-[1em] text-[32px] font-bold" {...props}>
                {children}
              </h1>
            );
          },
          h2({ node, children, ...props }) {
            return (
              <h2 className="appendix font-sans mb-[1em] text-[24px] font-bold" {...props}>
                {children}
              </h2>
            );
          },
          h3({ node, children, ...props }) {
            return (
              <h3 className="appendix font-sans mb-[1em] text-[20px] font-bold" {...props}>
                {children}
              </h3>
            );
          },
          blockquote({ node, children, ...props }) {
            return (
              <blockquote
                className="font-sans mb-[1em] font-semibold border-l-4 whitespace-pre-line dark:bg-zinc-600 bg-gray-100 text-black dark:text-white border-emerald-500 px-4"
                {...props}
              >
                {children.map((child, i) => {
                  let reactElement = child as JSX.Element;
                  if (reactElement.props) {
                    let div = React.createElement("div", { key: i }, reactElement.props?.children);

                    return div;
                  } else return child;
                })}
              </blockquote>
            );
          },
          p({ node, children, ...props }) {
            return (
              <p className="font-sans mb-[1em]" {...props}>
                {children}
              </p>
            );
          },
          img({ node, children, ...props }) {
            return (
              <Image
                width="0"
                height="0"
                sizes="100vw"
                src={props.src}
                alt="public"
                style={{ width: "100%", height: "auto" }}
              >
                {children}
              </Image>
            );
          },
          ol({ node, children, ...props }) {
            return <div className="mb-[1em] list-decimal">{children}</div>;
          },
          code: RemarkCode,
        }}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, customSanitizedSchema]]}
        remarkPlugins={[remarkGfm, remarkBreaks]}
      >
        {doc}
      </ReactMarkDown>
    </>
  );
};

export default ReactMD;
