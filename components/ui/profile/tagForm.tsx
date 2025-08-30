"use client";
import { useCallback } from "react";
import TagItem from "../items/tagItem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTagList } from "@/app/lib/fetchers/tag";
import { Skeleton } from "../skeleton";
import { useUI } from "@/components/providers/uiProvider";
import { Post } from "@prisma/client";

interface Tag {
  id: string;
  body: string;
  count: number; // 글 개수
}

export function TagForm() {
  const queryClient = useQueryClient();
  const { openConfirm, openToast } = useUI();
  const { isLoading, data: tagResult } = useQuery<
    QueryResponse<(Tag & { _count: { posts: number } })[]>
  >({
    queryKey: ["tag"],
    queryFn: fetchTagList,
  });

  const { mutate } = useMutation<
    QueryResponse<{ tag: Tag; post: Post[] }>,
    Error,
    { id: string }
  >({
    mutationFn: async (id) => {
      const result = await (
        await fetch(`/api/tag?id=${id}`, {
          method: "DELETE",
        })
      ).json();
      if (!result.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["tag"] });
      for (const post of result.data.post) {
        queryClient.setQueryData(
          ["post", post.id],
          (old: QueryResponse<Post>) => {
            if (!old) return old;
            return {
              ...old,
              data: {
                ...old.data,
                tagIds: post.tagIds, // []로 업데이트됨
              },
            };
          }
        );
      }
      console.log(result.data);
    },
    onError: (error) => {
      openToast(true, error.message, 1);
    },
  });

  const handleDelete = useCallback(async (id: string) => {
    const result = await openConfirm({
      title: "",
      msg: "해당 태그를 삭제하시겠습니까?",
      btnMsg: ["취소", "확인"],
    });
    if (result) {
      mutate({ id });
    }
  }, []);

  return (
    <div className="rounded-xl shadow  space-y-4">
      <h2 className="text-lg font-bold text-text1 mb-2">태그 관리</h2>

      <div className="flex gap-2 flex-wrap">
        {isLoading || !tagResult ? (
          Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-5 w-14" />
          ))
        ) : tagResult?.data.filter((v) => v.body !== "전체").length <= 0 ? (
          <span className="text-text3"> 등록된 태그 정보가 없습니다.</span>
        ) : (
          tagResult?.data
            .filter((v) => v.body !== "전체") // ✅ 전체 빼기
            .map((v) => (
              <div key={v.body} className="flex-none">
                <TagItem
                  clickEvt={handleDelete}
                  id={v.id}
                  text={`${v.body}(${v._count.posts})`}
                />
              </div>
            ))
        )}
      </div>
    </div>
  );
}
