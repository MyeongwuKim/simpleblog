"use client";

import ReactMD from "@/components/write/reactMD";
import LabelButton from "../buttons/labelButton";

import { FaUser } from "react-icons/fa6";
import { Comment } from "@prisma/client";
import { formatRelativeTime } from "@/app/hooks/useUtil";
import { useUI } from "@/components/providers/uiProvider";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

function CommentItem({ content, createdAt, id, name, isMe }: Comment) {
  const { openModal, openToast } = useUI();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { mutate } = useMutation<QueryResponse<Comment>, Error, { id: string }>(
    {
      mutationFn: async (id) => {
        const result = await (
          await fetch(`/api/comments?id=${id}`, {
            method: "DELETE",
          })
        ).json();
        if (!result.ok) throw new Error(result.error);
        return result;
      },
      onSuccess: (res) => {
        queryClient.setQueryData(["comments"], (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.filter(
                (comment: any) => comment.id !== res.data.id // ✅ 해당 아이디만 제거
              ),
            })),
          };
        });
      },
      onError: (error) => {
        openToast(true, error.message, 1);
      },
    }
  );
  const deleteCommentItem = async () => {
    const result = await openModal("ALERT", {
      title: "삭제",
      msg: "댓글을 삭제하시겠습니까?",
      btnMsg: ["취소", "확인"],
    });
    if (result) {
      mutate({ id });
    }
  };
  return (
    <div className="w-full h-full">
      <div className="w-full h-[54px] flex justify-between">
        <div className="flex">
          <div className="rounded-full h-12 w-12 bg-text3  mr-4 flex items-center justify-center">
            <FaUser className="w-8 h-8 text-text2" />
          </div>
          <div className="flex flex-col">
            <span className="text-text1">
              {!isMe ? (
                name
              ) : (
                <span className="text-cyan-400 font-bold">
                  {session ? "나" : "블로그주인"}
                </span>
              )}
            </span>
            <span className="text-text3">{formatRelativeTime(createdAt)}</span>
          </div>
        </div>
        {session && (
          <div className={`w-auto h-[40px] `}>
            <LabelButton
              color="cyan"
              className="underline"
              innerItem="삭제"
              onClickEvt={deleteCommentItem}
            />
          </div>
        )}
      </div>
      <div className="mt-8">
        <ReactMD doc={content} />
      </div>
      <div className="border-border1 border-b-[1px] mt-8"></div>
    </div>
  );
}

export default React.memo(CommentItem);
