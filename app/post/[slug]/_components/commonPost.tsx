"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  InfiniteData,
  UseMutateFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Image as ImageType, Post, Tag } from "@prisma/client";
import { formateDate, getDeliveryDomain } from "@/app/hooks/useUtil";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

import {
  fetchPostContentByPostId,
  fetchSiblingPost,
} from "@/app/lib/fetchers/post";

import { useSession } from "next-auth/react";

import Image from "next/image";
import { fetchCollectionPostList } from "@/app/lib/fetchers/collections";
import {
  IoChevronBack,
  IoChevronDown,
  IoChevronForward,
  IoChevronUp,
} from "react-icons/io5";
import { useUI } from "@/components/providers/uiProvider";
import PostSkeleton from "@/components/ui/skeleton";
import InfiniteScrollProvider from "@/components/layout/InfiniteScroll/infiniteScrollProvider";
import TagItem from "@/components/ui/items/tagItem";
import FooterItem from "@/components/ui/items/postFooterItem";
import { usePostDetailContext } from "@/components/providers/postDetailProvider";

const PostMarkdown = dynamic(() => import("@/components/write/reactMD"), {
  ssr: false,
  loading: () => (
    <div aria-hidden="true" className="space-y-4">
      <div className="h-4 w-full rounded bg-background2" />
      <div className="h-4 w-11/12 rounded bg-background2" />
      <div className="h-4 w-10/12 rounded bg-background2" />
      <div className="h-4 w-9/12 rounded bg-background2" />
    </div>
  ),
});

const PostSide = dynamic(() => import("./postSide"), {
  ssr: false,
  loading: () => null,
});

export default function CommonPost({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const route = useRouter();
  const { openToast } = useUI();
  const hasTrackedViewRef = useRef(false);
  //POST DELETE
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
    onSuccess: async (res) => {
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
      openToast(false, "성공적으로 삭제하였습니다.", 1);
      route.replace("/");
      queryClient.setQueryData(["post", postId], undefined);
      queryClient.invalidateQueries({ queryKey: ["post"], exact: true });
      queryClient.invalidateQueries({ queryKey: ["tag"] });
    },
    onError: (error) => openToast(true, error.message, 1),
  });

  const { mutate: postStatsMutate } = useMutation<QueryResponse<null>, Error>({
    mutationFn: async () => {
      const result = await (
        await fetch(`/api/post/${postId}/view`, {
          method: "POST",
        })
      ).json();

      return result;
    },
    onSuccess: async (res) => {
      if (res.ok) {
        queryClient.invalidateQueries({
          queryKey: ["poststats", postId],
          type: "inactive",
        });
        if (window.umami) {
          window.umami.track("post_view", {
            postId,
            slug: postData?.data.slug,
          });
        }
      }
    },
  });

  const {
    data: postData,
    isLoading: isPostLoading,
    isError: postError,
  } = useQuery<
    QueryResponse<
      Post & {
        tag: Tag[];
        images: ImageType[];
        collection: { id: string; slug: string } | null;
        thumbData: { width: number; height: number } | null;
      }
    >
  >({
    queryKey: ["post", postId],
    queryFn: () => {
      return fetchPostContentByPostId(postId);
    },
    staleTime: 600 * 1000,
  });

  const { data: sibData, isError: sibError } = useQuery<
    QueryResponse<{ prev: Post; next: Post }>
  >({
    queryKey: ["post", postId, "siblings"],
    queryFn: () => fetchSiblingPost(postId),
    staleTime: 0,
  });

  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!postData?.ok || session || hasTrackedViewRef.current) return;
    hasTrackedViewRef.current = true;
    postStatsMutate();
  }, [postData?.ok, postStatsMutate, session]);

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
        <PostSide headRef={headRef} content={postData.data.content} />

        {postData.data.collectionId && postData.data.collection && (
          <CollectionListBox
            postId={postData.data.id}
            collectionId={postData.data.collectionId}
            slug={postData.data.collection.slug}
          />
        )}

        <PostBody
          content={postData.data.content}
          thumbnail={postData.data.thumbnail}
          images={postData.data.images}
          thumbData={postData.data.thumbData}
        />
        <div className="w-full h-[1px] bg-text4 mt-20" />

        <PostFooter
          next={sibData?.data.next}
          prev={sibData?.data.prev}
          isError={sibError}
        />
      </div>
      <div className="z-30 bg-bg-page2 relative">
        <h2 className="text-text1 text-2xl my-20 text-center">
          이 게시물과 관련된 글
        </h2>
        <div className="relative h-auto py-16 mt-[120px] min-md:px-16 max-md:px-8 px-4">
          <InfiniteScrollProvider
            type="relatedPosts"
            queryKey={[
              "relatedPosts",
              { tags: postData.data.tag.map((v) => v.body), excludeId: postId },
            ]}
          />
        </div>
      </div>
    </>
  );
}

export function PostBody({
  content,
  thumbnail,
  images,
  thumbData,
}: {
  content: string;
  thumbnail: string | null;
  images: ImageType[];
  thumbData: { width: number; height: number } | null;
}) {
  const getFirstImageUrlFromMarkdown = (markdown: string) => {
    const match = markdown.match(/!\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/);
    return match?.[1] ?? null;
  };

  const extractImageIdFromDeliveryUrl = (url: string) => {
    const match = url.match(/imagedelivery\.net\/[^/]+\/([^/]+)\/public/);
    return match?.[1] ?? null;
  };

  const firstImageUrl = getFirstImageUrlFromMarkdown(content);
  const firstImageId = firstImageUrl
    ? extractImageIdFromDeliveryUrl(firstImageUrl)
    : null;

  const shouldHideThumbnail =
    !!thumbnail && !!firstImageId && thumbnail === firstImageId;

  return (
    <div id="post-body" className="my-40 min-h-[100px]">
      {!shouldHideThumbnail && thumbnail && thumbData && (
        <div className="w-full max-w-[768px] mx-auto flex justify-center">
          <Image
            src={getDeliveryDomain(thumbnail, "public")}
            alt="post-thumbnail"
            width={thumbData.width ?? 768}
            height={thumbData.height ?? 432}
            className="h-auto w-full object-contain"
            style={{ maxWidth: `${thumbData.width}px` }}
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}
      <PostMarkdown doc={content} images={images} />
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
    }, [route]);
    return (
      <div id="post-head" className="mt-20">
        <h1 ref={ref} className="font-bold text-5xl leading-[1.5] mb-8">
          {title}
        </h1>
        <div className="w-full flex justify-between mb-2 [&_span]:text-lg [&_span]:text-text3">
          <span>{formateDate(createdAt, "NOR")}</span>
          {session && (
            <div className={`gap-2 flex`}>
              <Link href={`/post-stats/${postId}`}>
                <span>통계</span>
              </Link>
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

function CollectionListBox({
  collectionId,
  slug,
  postId,
}: {
  collectionId: string;
  slug: string;
  postId: string;
}) {
  type CollectionPostListItem = Pick<Post, "id" | "title" | "slug">;
  const {
    data: collectionData,
    isLoading,
    isError,
  } = useQuery<
    QueryResponse<{ title: string; items: CollectionPostListItem[] }>
  >({
    queryKey: ["collections", collectionId],
    queryFn: () => fetchCollectionPostList(collectionId),
    staleTime: 600 * 1000,
  });
  const { collectionOpen, setCollectionOpen } = usePostDetailContext();

  const route = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const items = useMemo(
    () => collectionData?.data.items ?? [],
    [collectionData?.data.items]
  );

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < items.length - 1;

  useEffect(() => {
    if (!postId || items.length === 0) return;

    const idx = items.findIndex((item) => item.id === postId);

    if (idx !== -1) {
      setActiveIndex(idx);
    }
  }, [postId, items]);

  if (isLoading || isError || !collectionData) return null;

  return (
    <div className="rounded-xl bg-background2 p-6 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-text2">
          <Link href={`/collections/${slug}`}>{collectionData.data.title}</Link>
        </h2>
      </div>

      {/* Content */}
      {collectionOpen && (
        <ul className="mt-6 space-y-3">
          {items.map((post, idx) => {
            const active = idx === activeIndex;

            return (
              <li
                key={post.id}
                className="flex gap-2 text-lg transition-colors text-text2"
              >
                {idx + 1}.
                <Link
                  className={`hover:underline ${
                    active ? "text-text5" : "text-primary"
                  }`}
                  href={`/post/${post.slug}`}
                >
                  {post.title}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between text-text3">
        {/* 숨기기 */}
        <button
          className="flex items-center gap-1 hover:text-text2 cursor-pointer"
          onClick={() => setCollectionOpen(!collectionOpen)}
        >
          {collectionOpen ? (
            <>
              <IoChevronUp /> 숨기기
            </>
          ) : (
            <>
              <IoChevronDown /> 펼치기
            </>
          )}
        </button>

        {/* 🔥 글 이동 + 넘버링 */}
        {items.length > 1 && (
          <div className="flex items-center gap-3">
            {/* 이전 글 */}
            <button
              disabled={!canPrev}
              onClick={() => {
                if (!canPrev) return;
                route.push(`/post/${items[activeIndex - 1].slug}`);
              }}
              className={`p-1 ${
                canPrev ? "hover:text-text2 cursor-pointer" : "opacity-30"
              }`}
            >
              <IoChevronBack size={18} />
            </button>

            {/* ✅ 라우트 기준 넘버링 */}
            <span className="text-sm">
              {activeIndex + 1} / {items.length}
            </span>

            {/* 다음 글 */}
            <button
              disabled={!canNext}
              onClick={() => {
                if (!canNext) return;
                route.push(`/post/${items[activeIndex + 1].slug}`);
              }}
              className={`p-1 ${
                canNext ? "hover:text-text2 cursor-pointer" : "opacity-30"
              }`}
            >
              <IoChevronForward size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

PostHead.displayName = "PostHead";
