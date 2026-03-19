"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Node, Parent } from "unist";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { Root, Heading, Text } from "mdast";
import remarkSlug from "remark-slug";
import LabelButton from "@/components/ui/buttons/labelButton";

function extractHeadings(markdown: string) {
  const tree = unified()
    .use(remarkParse)
    .use(remarkSlug)
    .runSync(unified().use(remarkParse).parse(markdown)) as Root;

  const headings: { level: number; text: string; id: string }[] = [];

  const visit = (node: Node) => {
    if (node.type === "heading") {
      const heading = node as Heading;

      const text = heading.children
        .filter((child): child is Text => child.type === "text")
        .map((child) => child.value)
        .join("");

      const id = (heading.data?.id as string) ?? "";

      headings.push({ level: heading.depth, text, id });
    }

    if ("children" in node) {
      (node as Parent).children.forEach(visit);
    }
  };

  visit(tree);
  return headings;
}

export default function PostSide({
  content,
  headRef,
}: {
  content: string;
  headRef: React.RefObject<HTMLDivElement | null>;
}) {
  const sideRef = useRef<HTMLDivElement>(null);
  const [isFixed, setIsFixed] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const headings = useMemo(() => extractHeadings(content), [content]);

  useEffect(() => {
    const handleScroll = () => {
      if (!headRef.current) return;
      const headBottom =
        headRef.current.getBoundingClientRect().bottom + window.scrollY;
      setIsFixed(window.scrollY > headBottom);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headRef]);

  useEffect(() => {
    const handleScroll = () => {
      const offset = 20;
      const currentY = window.scrollY + offset;

      const sections = headings
        .map(({ id }) => {
          const el = document.getElementById(id);
          if (!el) return null;
          return {
            id,
            top: el.getBoundingClientRect().top + window.scrollY - offset,
          };
        })
        .filter((v): v is { id: string; top: number } => v !== null);

      let active: string | null = null;
      for (let i = 0; i < sections.length; i++) {
        if (currentY >= sections[i].top) {
          active = sections[i].id;
        } else {
          break;
        }
      }

      setActiveId(active);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const target = document.getElementById(id);

    if (!target) return;
    const offset = 20;
    const targetY =
      target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <div
      ref={sideRef}
      className={`${
        headings.length <= 0 ? "hidden" : "relative mt-2  xl:block hidden"
      }`}
    >
      <div className="absolute left-full ">
        <div
          className={`${
            isFixed ? "fixed top-[112px]" : ""
          } w-[240px] ml-[3rem] h-auto bg-background5 p-4 z-0`}
        >
          <ul>
            {headings.map(({ level, text, id }, i) => {
              const isActive = activeId === id;
              return (
                <li
                  key={i}
                  style={{ paddingLeft: (level - 1) * 10 }}
                  className="w-full h-auto overflow-hidden ease-in duration-100 hover:scale-[1.05]"
                >
                  <LabelButton
                    onClickEvt={() => scrollToHeading(id)}
                    color={isActive ? "cyan" : "gray"}
                    className={`text-sm ${
                      isActive ? "font-bold text-cyan-500" : ""
                    }`}
                    innerItem={<span>{text}</span>}
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
