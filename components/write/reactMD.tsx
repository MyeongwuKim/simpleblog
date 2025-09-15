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
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

interface IReactMD {
  doc: string;
}

const ReactMD: NextPage<IReactMD> = ({ doc }) => {
  const pathname = usePathname();
  const customSanitizedSchema = {
    ...defaultSchema,
    tagNames:
      pathname == "/comments"
        ? ["br"]
        : defaultSchema.tagNames.filter(
            (tag) => !["script", "iframe", "object", "embed", ""].includes(tag)
          ),
    attributes: {
      ...defaultSchema.attributes,
      img: ["src", "alt", "title", "width", "height", "sizes", "srcset"],
      h1: ["className"],
      h2: ["className"],
      h3: ["className"],
    },
    protocols: {
      ...defaultSchema.protocols,
      src: ["http", "https", "data", "blob"],
    },
  };

  const contentPlugins = [remarkGfm, remarkBreaks];

  return (
    <>
      <ReactMarkDown
        components={{
          a({ children, ...props }) {
            return (
              <a className="mb-[1em]" target="_blank" {...props}>
                {children}
              </a>
            );
          },
          h1({ children, ...props }) {
            return (
              <h1 className="text-4xl font-bold leading-snug my-8" {...props}>
                {children}
              </h1>
            );
          },
          h2({ children, ...props }) {
            return (
              <h2
                className="text-2xl font-semibold leading-snug my-4"
                {...props}
              >
                {children}
              </h2>
            );
          },
          h3({ children, ...props }) {
            return (
              <h3
                className="appendix font-sans mb-[1em] text-[20px] font-bold"
                {...props}
              >
                {children}
              </h3>
            );
          },
          blockquote({ children, ...props }) {
            return (
              <blockquote
                className="font-sans mb-[1em] font-semibold border-l-4 whitespace-pre-line dark:bg-zinc-600 bg-gray-100 text-black dark:text-white border-emerald-500 px-4"
                {...props}
              >
                {children.map((child, i) => {
                  const reactElement = child as JSX.Element;
                  if (reactElement.props) {
                    const div = React.createElement(
                      "div",
                      { key: i },
                      reactElement.props?.children
                    );

                    return div;
                  } else return child;
                })}
              </blockquote>
            );
          },
          p({ children, ...props }) {
            return (
              <p
                className="text-base leading-relaxed my-4 text-text1"
                {...props}
              >
                {children}
              </p>
            );
          },
          img({ ...props }) {
            return (
              <Image
                width="0"
                height="0"
                sizes="100vw"
                src={props.src}
                alt="public"
                style={{ width: "100%", height: "auto" }}
                priority
              />
            );
          },
          ol({ children }) {
            return (
              <ol className="mb-[1em] list-decimal list-outside pl-6">
                {children}
              </ol>
            );
          },
          hr({}) {
            return <hr className="border-border1"></hr>;
          },
          code: RemarkCode,
        }}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize, customSanitizedSchema],
          rehypeSlug,
          rehypeAutolinkHeadings,
        ]}
        remarkPlugins={contentPlugins}
      >
        {doc}
      </ReactMarkDown>
    </>
  );
};

export default ReactMD;
