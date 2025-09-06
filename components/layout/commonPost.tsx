"use client";
import TagItem from "../ui/items/tagItem";
import ReactMD from "../write/reactMD";
import FooterItem from "../ui/items/postFooterItem";
import LabelButton from "../ui/buttons/labelButton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  InfiniteData,
  UseMutateFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Post, Tag } from "@prisma/client";
import { formateDate, getDeliveryDomain } from "@/app/hooks/useUtil";
import Slugger from "github-slugger";
import { Node, Parent } from "unist";
import remarkParse from "remark-parse";
import { unified } from "unified";
import React, { useCallback, useEffect, useRef, useState } from "react";
import PostSkeleton from "../ui/skeleton";
import {
  fetchPostContentByPostId,
  fetchSiblingPost,
} from "@/app/lib/fetchers/post";
import { useUI } from "../providers/uiProvider";
import { useSession } from "next-auth/react";
import InfiniteScrollProvider from "./InfiniteScroll/infiniteScrollProvider";
import { Root, Heading, Text } from "mdast";
import Image from "next/image";

export default function CommonPost({ postId }: { postId: string }) {
  const queryClient = useQueryClient();
  const route = useRouter();
  const { openToast } = useUI();

  const {
    data: postData,
    isLoading: isPostLoading,
    isError: postError,
  } = useQuery<QueryResponse<Post & { tag: Tag[] }>>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostContentByPostId(postId),
    staleTime: 600 * 1000,
  });

  const { data: sibData, isError: sibError } = useQuery<
    QueryResponse<{ prev: Post; next: Post }>
  >({
    queryKey: ["post", postId, "siblings"],
    queryFn: () => fetchSiblingPost(postId),
    staleTime: 0,
  });
  const { mutate, isPending } = useMutation<
    QueryResponse<{ post: Post; tag: Tag[] }>,
    Error
  >({
    mutationFn: async () => {
      const result = await (
        await fetch(`/api/post/${postId}`, {
          method: "DELETE",
        })
      ).json();

      if (!result.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<
        InfiniteData<{
          data: Post[];
          nextCursor?: string;
        }>
      >(["post"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.filter((p) => p.id !== postId),
          })),
        };
      });
      //태그 캐시 업데이트(삭제)
      queryClient.setQueryData<
        QueryResponse<(Tag & { _count: { posts: number } })[]>
      >(["tag"], (old) => {
        if (!old) return old;

        let data = [...old.data];
        data = data.map((t) =>
          t.body === "전체"
            ? {
                ...t,
                _count: { posts: Math.max(t._count.posts - 1, 0) }, // 음수 방지
              }
            : t
        );

        for (const deletedTag of res.data.tag) {
          const existing = data.find((t) => t.body === deletedTag.body);
          if (existing) {
            if (existing._count.posts > 1) {
              existing._count.posts -= 1;
            } else {
              data = data.filter((t) => t.body !== deletedTag.body);
            }
          }
        }
        return { ...old, data };
      });
      // 해당 post 상세 캐시 제거
      queryClient.removeQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["post"], exact: true });
      queryClient.invalidateQueries({ queryKey: ["tag"] });
      openToast(false, "성공적으로 삭제하였습니다.", 1);
      route.back();
    },
    onError: (error) => openToast(true, error.message, 1),
  });

  const headRef = useRef<HTMLDivElement>(null);

  function extractHeadings(markdown: string) {
    const tree = unified().use(remarkParse).parse(markdown) as Root;
    const headings: { level: number; text: string; id: string }[] = [];
    const slugger = new Slugger();

    const visit = (node: Node) => {
      if (node.type === "heading") {
        const heading = node as Heading;

        const text = heading.children
          .filter((child): child is Text => child.type === "text")
          .map((child) => child.value)
          .join("");

        const id = slugger.slug(text);
        headings.push({ level: heading.depth, text, id });
      }

      if ("children" in node) {
        (node as Parent).children.forEach(visit);
      }
    };

    visit(tree);
    return headings;
  }

  if (isPostLoading || !postData || isPending || postError) {
    return (
      <div className="layout mt-20 h-full relative">
        <PostSkeleton />;
      </div>
    );
  }

  return (
    <>
      <div className="layout mt-20 h-full relative">
        <PostHead
          ref={headRef}
          title={postData.data.title}
          tag={postData.data.tag}
          createdAt={postData.data.createdAt}
          postId={postData.data.id}
          mutate={mutate}
        />
        <PostSide
          headRef={headRef}
          headings={extractHeadings(postData.data.content)}
        />
        <PostBody
          content={postData.data.content}
          thumbnail={postData.data.thumbnail}
        />
        <div className="w-full h-[1px] bg-text4 mt-20" />

        <PostFooter
          next={sibData?.data.next}
          prev={sibData?.data.prev}
          isError={sibError}
        />
      </div>
      <h2 className="text-text1 text-2xl my-20 text-center">
        이 게시물과 관련된 글
      </h2>
      <InfiniteScrollProvider
        type="relatedPosts"
        queryKey={[
          "relatedPosts",
          { tags: postData.data.tag.map((v) => v.body), excludeId: postId },
        ]}
      />
    </>
  );
}

export function PostBody({
  content,
  thumbnail,
}: {
  content: string;
  thumbnail: string | null;
}) {
  return (
    <div id="post-body" className="my-40 min-h-[100px]">
      {thumbnail && (
        <div className="max-w-[768px]">
          <Image
            width={200}
            height={200}
            className="h-auto w-full "
            src={getDeliveryDomain(thumbnail, "public")}
            alt="post-thumbnail"
            priority
          />
        </div>
      )}
      <ReactMD doc={content} />
    </div>
  );
}

interface HeadProps {
  title: string;
  tag: Tag[];
  createdAt: Date;
  postId: string;
  mutate: UseMutateFunction;
}
const PostHead = React.forwardRef<HTMLDivElement, HeadProps>(
  ({ tag, title, createdAt, postId, mutate }, ref) => {
    const { data: session } = useSession();
    const route = useRouter();
    const { openModal } = useUI();

    const removeEvt = async () => {
      const result = await openModal("CONFIRM", {
        title: "글 삭제",
        msg: "글을 지우시겠습니까?",
        btnMsg: ["취소", "확인"],
      });

      if (result) mutate();
    };

    const tagItemClick = useCallback((body: string) => {
      route.push(`/?tag=${body}`);
    }, []);
    return (
      <div id="post-head" className="mt-20">
        <h1 ref={ref} className="font-bold text-5xl leading-[1.5] mb-8">
          {title}
        </h1>
        <div className="w-full flex justify-between mb-2 [&_span]:text-lg [&_span]:text-text3">
          <span>{formateDate(createdAt, "NOR")}</span>
          {session && (
            <div className={`gap-2 flex`}>
              <Link href={`/write?id=${postId}`}>
                <span>수정</span>
              </Link>
              <span className="cursor-pointer" onClick={removeEvt}>
                삭제
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {tag.length <= 0 ? (
            <span className="text-text3">등록된 태그가 없습니다.</span>
          ) : (
            tag.map((v) => (
              <TagItem
                clickEvt={tagItemClick}
                clickValueType="body"
                body={v.body}
                id={""}
                key={v.body}
                text={v.body}
              />
            ))
          )}
        </div>
      </div>
    );
  }
);
interface PostFooterProps {
  next: Post | undefined;
  prev: Post | undefined;
  isError: boolean;
}
function PostFooter({ next, prev, isError }: PostFooterProps) {
  return (
    <div className="mt-30">
      <div className="w-full grid grid-cols-2 gap-8">
        {!isError && prev ? (
          <FooterItem slug={prev?.slug} title={prev?.title} dir={0} />
        ) : (
          <div></div>
        )}
        {next ? (
          <FooterItem slug={next?.slug} title={next?.title} dir={1} />
        ) : (
          <div></div>
        )}
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
  const [activeId, setActiveId] = useState<string | null>(null);

  // 사이드바 fixed 처리
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
      const offset = 20; // scrollToHeading과 동일하게 보정
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

      // 현재 스크롤과 가장 가까운 heading 찾기
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
      <div className="absolute left-full z-50">
        <div
          className={`${
            isFixed ? "fixed top-[112px]" : ""
          } w-[240px] ml-[3rem] h-auto bg-background5 p-4`}
        >
          <ul>
            {headings.map(({ level, text, id }, i) => {
              const isActive = activeId === id;
              return (
                <li
                  key={i}
                  style={{ marginLeft: (level - 1) * 10 }}
                  className={`w-full h-auto overflow-hidden ease-in duration-100 hover:scale-[1.05]`}
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
PostHead.displayName = "PostHead";
