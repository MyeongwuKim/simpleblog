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
import {
  UseMutateFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Post, Tag } from "@prisma/client";
import { formateDate } from "@/app/hooks/useUtil";
import Slugger from "github-slugger";

import remarkParse from "remark-parse";
import { unified } from "unified";
import React, { useEffect, useRef, useState } from "react";
import PostSkeleton from "../ui/skeleton";
import {
  fetchAllPostContentByPostId,
  fetchPostIdBySlug,
} from "@/app/lib/fetchers/post";
import { useUI } from "../providers/uiProvider";

export default function CommonPost() {
  const params = useParams();
  const queryClient = useQueryClient();
  const route = useRouter();
  const { openToast } = useUI();
  const slug = params.slug as string;

  const { data: slugResult, isError: slugError } = useQuery<
    QueryResponse<{ id: string }>
  >({
    queryKey: ["post", slug],
    queryFn: () => fetchPostIdBySlug(slug),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });

  const {
    data: result,
    isLoading: isPostLoading,
    isError: postError,
  } = useQuery({
    queryKey: ["post", slugResult?.data?.id],
    queryFn: () => fetchAllPostContentByPostId(slugResult!.data.id),
    enabled: !!slugResult?.data?.id, // id가 있으면 실행
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
  const { mutate, isPending } = useMutation<QueryResponse<Post>, Error>({
    mutationFn: async (data) => {
      const result = await (
        await fetch(`/api/post/postId/${slugResult?.data.id}`, {
          method: "DELETE",
        })
      ).json();

      if (!result.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: (res) => {
      queryClient.setQueryData(["post"], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: QueryResponse<Post[]>) => ({
            ...page,
            data: page.data.filter((p) => p.id !== slugResult?.data.id),
          })),
        };
      });
      // 해당 post 상세 캐시 제거
      queryClient.removeQueries({ queryKey: ["post", slugResult?.data.id] });
      queryClient.removeQueries({ queryKey: ["post", slug] });
      queryClient.invalidateQueries({ queryKey: ["post"], exact: true });
      queryClient.invalidateQueries({ queryKey: ["tag"] });
      openToast(false, "성공적으로 삭제하였습니다.", 1);
      route.back();
    },
    onError: (error) => openToast(true, error.message, 1),
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

  if (isPostLoading || !result || isPending || slugError || postError) {
    return <PostSkeleton />;
  }

  const {
    data: { current, next, prev },
    ok,
  } = result as QueryResponse<{
    current: Post & { tag: Tag[] };
    prev: Post;
    next: Post;
  }>;

  return (
    <div className="w-full h-full">
      <PostHead
        ref={headRef}
        title={current.title}
        tag={current.tag}
        createdAt={current.createdAt}
        postId={current.id}
        mutate={mutate}
      />
      <PostSide headRef={headRef} headings={extractHeadings(current.content)} />
      <PostBody content={current.content} />
      <div className="w-full h-[1px] bg-text4 mt-20" />
      <PostFooter next={next} prev={prev} />
    </div>
  );
}

export function PostBody({ content }: { content: string }) {
  return (
    <div id="post-body" className="my-40 min-h-[100px]">
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
    const { openModal } = useUI();

    const removeEvt = async () => {
      const result = await openModal("ALERT", {
        title: "글 삭제",
        msg: "글을 지우시겠습니까?",
        btnMsg: ["취소", "확인"],
      });
      if (result) mutate();
    };
    return (
      <div id="post-head" className="mt-20">
        <h1 ref={ref} className="font-bold text-5xl leading-[1.5] mb-8">
          {title}
        </h1>
        <div className="w-full flex justify-between mb-2 [&_span]:text-lg [&_span]:text-text3">
          <span>{formateDate(createdAt, "NOR")}</span>
          <div className="gap-2 flex">
            <Link href={`/write?id=${postId}`}>
              <span>수정</span>
            </Link>
            <span className="cursor-pointer" onClick={removeEvt}>
              삭제
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {tag.length <= 0 ? (
            <span className="text-text3">등록된 태그가 없습니다.</span>
          ) : (
            tag.map((v, i) => <TagItem id={v.id} key={i} text={v.body} />)
          )}
        </div>
      </div>
    );
  }
);
interface PostFooterProps {
  next: Post;
  prev: Post;
}
function PostFooter({ next, prev }: PostFooterProps) {
  return (
    <div className="mt-30">
      <div className="w-full flex justify-between flex-auto">
        <div className={`${next ? "" : "invisible"}`}>
          <FooterItem slug={next?.slug} title={next?.title} dir={0} />
        </div>
        <div className={`${prev ? "" : "invisible"}`}>
          <FooterItem slug={prev?.slug} title={prev?.title} dir={1} />
        </div>
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
                    color="gray"
                    className="text-sm"
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
