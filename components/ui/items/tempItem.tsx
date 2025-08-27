"use client";
import { Post } from "@prisma/client";
import LabelButton from "../buttons/labelButton";
import { formatRelativeTime } from "@/app/hooks/useUtil";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUI } from "@/components/providers/uiProvider";
import { useCallback } from "react";

export default function TempItem({ preview, title, updatedAt, id }: Post) {
  const queryClient = useQueryClient();
  const { openToast, openModal } = useUI();
  const { mutate, isPending } = useMutation<QueryResponse<Post>, Error>({
    mutationFn: async () => {
      const result = await (
        await fetch(`/api/post/postId/${id}`, {
          method: "DELETE",
        })
      ).json();

      if (!result.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: (res) => {
      queryClient.setQueryData(["temp"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => {
            return {
              ...page,
              data: page.data.filter((post: any) => post.id !== id),
            };
          }),
        };
      });
      openToast(false, "임시글이 삭제 되었습니다.", 1);
    },
    onError: (error) => openToast(true, error.message, 1),
  });
  const deleteTempPost = useCallback(async () => {
    const result = await openModal("ALERT", {
      title: "임시글 삭제",
      msg: "임시글을 지우시겠습니까?",
      btnMsg: ["취소", "확인"],
    });
    if (result) mutate();
  }, []);
  return (
    <div className="w-full h-full  flex flex-col py-4 gap-4 border-b border-border1">
      <Link href={`/write?id=${id}`}>
        <h3 className="text-text1 font-bold text-2xl">{title}</h3>
      </Link>
      <Link href={`/write?slug=${id}`}>
        <p className="line-clamp-3 text-text2 leading-[1.5em]">{preview}</p>
      </Link>
      <div className="text-text3 flex justify-between">
        <span>{formatRelativeTime(updatedAt)}</span>
        <div className={`w-auto h-[40px] `}>
          <LabelButton
            color="cyan"
            className="underline"
            innerItem="삭제"
            onClickEvt={deleteTempPost}
          />
        </div>
      </div>
    </div>
  );
}
