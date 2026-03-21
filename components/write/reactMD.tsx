"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Image as ImageType } from "@prisma/client";
import ReactMarkDown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import RemarkCode from "@/components/write/_components/remark-code";
import Callout from "./_components/callout";
import { parseCallout } from "./_utils/parser";

interface ReactMDProps {
  doc: string;
  images?: ImageType[];
}

type MarkdownComponentProps = {
  children?: React.ReactNode;
  id?: string;
  src?: string;
  alt?: string;
  [key: string]: unknown;
};

const extractImageIdFromDeliveryUrl = (url: string) => {
  const match = url.match(/imagedelivery\.net\/[^/]+\/([^/]+)\/public/);
  return match?.[1] ?? null;
};

const baseComponents: Record<
  string,
  (props: MarkdownComponentProps) => React.ReactNode
> = {
  table({ children, ...props }: MarkdownComponentProps) {
    return (
      <div
        {...props}
        className="my-10 overflow-x-auto rounded-xl border border-gray-200 shadow-sm dark:border-zinc-700"
      >
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    );
  },
  thead({ children }: MarkdownComponentProps) {
    return (
      <thead className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900">
        {children}
      </thead>
    );
  },
  th({ children }: MarkdownComponentProps) {
    return (
      <th className="border-b border-gray-200 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:border-zinc-700 dark:text-gray-300">
        {children}
      </th>
    );
  },
  tbody({ children }: MarkdownComponentProps) {
    return <tbody className="bg-white dark:bg-zinc-950">{children}</tbody>;
  },
  tr({ children }: MarkdownComponentProps) {
    return (
      <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-zinc-900">
        {children}
      </tr>
    );
  },
  td({ children }: MarkdownComponentProps) {
    return (
      <td className="border-b border-gray-100 px-5 py-4 align-top text-gray-800 dark:border-zinc-800 dark:text-gray-200">
        {children}
      </td>
    );
  },
  a({ children, ...props }: MarkdownComponentProps) {
    return (
      <a className="mb-[1em]" target="_blank" {...props}>
        {children}
      </a>
    );
  },
  h1({ children, ...props }: MarkdownComponentProps) {
    return (
      <h1
        id={props.id}
        className="mt-10 mb-6 text-[2.5rem] font-bold"
        {...props}
      >
        {children}
      </h1>
    );
  },
  h2({ children, ...props }: MarkdownComponentProps) {
    return (
      <h2 id={props.id} className="mt-8 mb-4 text-[2rem] font-bold">
        {children}
      </h2>
    );
  },
  h3({ children, ...props }: MarkdownComponentProps) {
    return (
      <h3 id={props.id} className="mt-6 mb-2 text-[1.5rem] font-semibold">
        {children}
      </h3>
    );
  },
  blockquote({ children, ...props }: MarkdownComponentProps) {
    const { type, content } = parseCallout(children);

    if (type) {
      return <Callout type={type}>{content}</Callout>;
    }

    return (
      <blockquote
        className="mb-[1em] border-l-4 border-emerald-500 bg-background5 py-4 pr-4 pl-8 leading-[1.7] text-text1"
        {...props}
      >
        {children}
      </blockquote>
    );
  },
  p({ children, ...props }: MarkdownComponentProps) {
    return (
      <p className="my-4 text-base" {...props}>
        {children}
      </p>
    );
  },
  ol({ children }: MarkdownComponentProps) {
    return <ol className="mb-[1em] list-decimal list-outside pl-6">{children}</ol>;
  },
  hr() {
    return <hr className="border-border1" />;
  },
  ul({ children }: MarkdownComponentProps) {
    return <ul className="mb-[1em] list-disc list-outside pl-6">{children}</ul>;
  },
  li({ children }: MarkdownComponentProps) {
    return <li>{children}</li>;
  },
  code: RemarkCode as unknown as (
    props: MarkdownComponentProps
  ) => React.ReactNode,
};

export default function ReactMD({ doc, images = [] }: ReactMDProps) {
  const pathname = usePathname();
  const imageMap = new Map(images.map((img) => [img.imageId, img]));
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

  return (
    <ReactMarkDown
      className="leading-relaxed text-text1"
      components={{
        ...(baseComponents as Record<string, unknown>),
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
          const safeHref = typeof href === "string" ? href : undefined;
          const isExternal = safeHref?.startsWith("http");
          return (
            <a
              href={safeHref}
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

        img({ src, alt }: MarkdownComponentProps) {
          const safeSrc = typeof src === "string" ? src : "";
          const imageId = extractImageIdFromDeliveryUrl(safeSrc);
          const meta = imageId ? imageMap.get(imageId) : null;

          if (!meta?.width || !meta?.height) {
            return (
              <Image
                src={safeSrc}
                alt={alt ?? ""}
                width={1200}
                height={675}
                sizes="(max-width: 768px) 100vw, 768px"
                unoptimized
                className="mx-auto block h-auto max-w-full"
                style={{ width: "100%", height: "auto" }}
              />
            );
          }

          return (
            <Image
              src={safeSrc}
              alt={alt ?? ""}
              width={meta.width}
              height={meta.height}
              sizes="(max-width: 768px) 100vw, 768px"
              className="mx-auto block h-auto max-w-full"
              style={{
                width: "100%",
                maxWidth: `${meta.width}px`,
                height: "auto",
              }}
            />
          );
        },
      } as Record<string, (props: MarkdownComponentProps) => React.ReactNode>}
      rehypePlugins={[
        [rehypeSanitize, customSanitizedSchema],
        rehypeSlug,
        rehypeAutolinkHeadings,
      ]}
      remarkPlugins={[remarkGfm, remarkBreaks]}
    >
      {doc}
    </ReactMarkDown>
  );
}
