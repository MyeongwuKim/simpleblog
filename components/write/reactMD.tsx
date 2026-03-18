"use client";
import { NextPage } from "next";
import { Image as ImageType } from "@prisma/client";
import remarkGfm from "remark-gfm";
import ReactMarkDown from "react-markdown";
import remarkBreaks from "remark-breaks";
import Image from "next/image";
import RemarkCode from "@/components/write/_components/remark-code";
import { defaultSchema } from "rehype-sanitize";
import rehypeSanitize from "rehype-sanitize";
import { usePathname } from "next/navigation";
import React from "react";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import Callout from "./_components/callout";
import { parseCallout } from "./_utils/parser";

interface IReactMD {
  doc: string;
  images: ImageType[];
}

const extractImageIdFromDeliveryUrl = (url: string) => {
  const match = url.match(/imagedelivery\.net\/[^/]+\/([^/]+)\/public/);
  return match?.[1] ?? null;
};

const ReactMD: NextPage<IReactMD> = ({ doc, images }) => {
  const pathname = usePathname();
  const imageMap = new Map(images?.map((img) => [img.imageId, img]));
  const customSanitizedSchema = {
    ...defaultSchema,
    tagNames:
      pathname === "/comments"
        ? ["br"]
        : [...(defaultSchema.tagNames ?? []), "div", "span"],
    attributes: {
      ...defaultSchema.attributes,
      div: ["className", "style"],
      span: ["className", "style"],
      img: ["src", "alt", "title", "width", "height", "sizes", "srcset"],
      h1: ["className"],
      h2: ["className"],
      h3: ["className"],
      table: ["className"],
    },
    protocols: {
      ...defaultSchema.protocols,
      src: ["http", "https", "data", "blob"],
    },
  };

  const contentPlugins = [remarkGfm, remarkBreaks];

  return (
    <ReactMarkDown
      className="leading-relaxed text-text1"
      components={{
        table({ children, ...props }) {
          return (
            <div
              {...props}
              className="my-10 overflow-x-auto rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm"
            >
              <table className="w-full border-collapse text-sm">
                {children}
              </table>
            </div>
          );
        },

        thead({ children }) {
          return (
            <thead className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900">
              {children}
            </thead>
          );
        },

        th({ children }) {
          return (
            <th
              className="
                px-5 py-3
                text-left text-xs font-semibold uppercase tracking-wide
                text-gray-600 dark:text-gray-300
                border-b border-gray-200 dark:border-zinc-700
              "
            >
              {children}
            </th>
          );
        },

        tbody({ children }) {
          return (
            <tbody className="bg-white dark:bg-zinc-950">{children}</tbody>
          );
        },

        tr({ children }) {
          return (
            <tr
              className="
                transition-colors
                hover:bg-gray-50 dark:hover:bg-zinc-900
              "
            >
              {children}
            </tr>
          );
        },

        td({ children }) {
          return (
            <td
              className="
                px-5 py-4
                align-top
                text-gray-800 dark:text-gray-200
                border-b border-gray-100 dark:border-zinc-800
              "
            >
              {children}
            </td>
          );
        },

        a({ children, href, ...props }) {
          const isExternal = href?.startsWith("http");
          return (
            <a
              href={href}
              className="text-cyan-500 underline underline-offset-4 break-all transition-colors hover:text-cyan-400"
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noreferrer noopener" : undefined}
              {...props}
            >
              {children}
            </a>
          );
        },

        h1({ children, ...props }) {
          return (
            <h1
              id={props.id}
              className="text-[2.5rem] font-bold mt-10 mb-6"
              {...props}
            >
              {children}
            </h1>
          );
        },

        h2: ({ children, ...props }) => (
          <h2 id={props.id} className="mt-8 mb-4 text-[2rem] font-bold">
            {children}
          </h2>
        ),

        h3: ({ children, ...props }) => (
          <h3 id={props.id} className="mt-6 mb-2 text-[1.5rem] font-semibold">
            {children}
          </h3>
        ),

        blockquote({ children, ...props }) {
          const { type, content } = parseCallout(children);

          if (type) {
            return <Callout type={type}>{content}</Callout>;
          }

          return (
            <blockquote
              className="mb-[1em] border-l-4 border-emerald-500 bg-background5 
              py-4 pr-4 pl-8 text-text1 leading-[1.7]"
              {...props}
            >
              {children}
            </blockquote>
          );
        },

        p({ children, ...props }) {
          return (
            <p className="text-base my-4" {...props}>
              {children}
            </p>
          );
        },

        img({ ...props }) {
          const src = props.src ?? "";
          const imageId = extractImageIdFromDeliveryUrl(src);
          const meta = imageId ? imageMap.get(imageId) : null;

          if (!meta?.width || !meta?.height) {
            return (
              <img
                src={src}
                alt={props.alt ?? ""}
                className="block mx-auto max-w-full h-auto"
              />
            );
          }

          return (
            <Image
              src={src}
              alt={props.alt ?? ""}
              width={meta.width}
              height={meta.height}
              className="block mx-auto max-w-full h-auto"
              style={{
                width: "100%",
                maxWidth: `${meta.width}px`,
                height: "auto",
              }}
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

        hr() {
          return <hr className="border-border1" />;
        },

        ul({ children }) {
          return (
            <ul className="mb-[1em] list-disc list-outside pl-6">{children}</ul>
          );
        },

        li({ children }) {
          return <li>{children}</li>;
        },

        code: RemarkCode,
      }}
      rehypePlugins={[
        [rehypeSanitize, customSanitizedSchema],
        rehypeSlug,
        rehypeAutolinkHeadings,
      ]}
      remarkPlugins={contentPlugins}
    >
      {doc}
    </ReactMarkDown>
  );
};

export default ReactMD;
