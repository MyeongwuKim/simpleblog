"use client";

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import DefButton from "../ui/buttons/defButton";
import InputField from "../ui/input/inputField";
import { TextAreaField } from "../ui/input/textAreaField";
import { useCallback, useState } from "react";
import { useUI } from "../providers/uiProvider";
import { Comment } from "@prisma/client";
import { useSession } from "next-auth/react";

export default function CommentsLayout() {
  const queryClient = useQueryClient();
  const { openToast } = useUI();
  const { data: session } = useSession();
  const [name, setName] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const { mutate } = useMutation<
    QueryResponse<Comment>,
    Error,
    Omit<Comment, "id" | "createdAt"> & { token: unknown }
  >({
    mutationFn: async (data) => {
      const result = await (
        await fetch("/api/comments", {
          method: "POST",
          body: JSON.stringify({ ...data }),
        })
      ).json();
      if (!result.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: (res) => {
      setName("");
      setContent("");
      window.grecaptcha.reset();

      queryClient.setQueryData<
        InfiniteData<{
          data: Comment[];
          nextCursor?: string;
        }>
      >(["comments"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page, idx) =>
            idx === 0
              ? {
                  ...page,
                  data: [res.data, ...page.data],
                }
              : page
          ),
        };
      });

      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error) => {
      openToast(true, error.message, 1);
    },
  });

  const onChangeText = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target;

      switch (id) {
        case "name":
          setName(value);
          break;
        case "content":
          setContent(value);
          break;
      }
    },
    []
  );
  const rules = [
    // 로그인 안 했을 때만 이름 체크
    ...(!session
      ? [
          {
            check: name.trim().length > 0,
            message: "이름을 입력해주세요.",
          },
        ]
      : []),

    {
      check: content.trim().length > 0,
      message: "내용을 입력해주세요.",
    },
    {
      check: content.trim().length >= 10,
      message: "내용은 최소 10자 이상 입력해주세요.",
    },
  ];

  const validate = () => {
    for (const rule of rules) {
      if (!rule.check) {
        openToast(true, rule.message, 1);
        return false;
      }
    }
    return true;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!validate()) return;
        const token = window.grecaptcha.getResponse();
        if (!token) {
          openToast(true, "로봇이 아님을 인증해주세요.", 1);
          return;
        }

        mutate({ content, name, isMe: session ? true : false, token });
      }}
      className="flex flex-col gap-4 mb-20"
    >
      {!session && (
        <div className="flex flex-auto">
          <InputField
            value={name}
            onChange={onChangeText}
            size="md"
            id="name"
            placeholder="이름"
            type="text"
          />
        </div>
      )}
      <div className="h-[98px]">
        <TextAreaField
          value={content}
          maxLength={300}
          id="content"
          placeholder="댓글 입력"
          onChange={onChangeText}
        />
      </div>

      <div className="w-full  h-[45px]">
        <div
          className="g-recaptcha absolute"
          data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        />
        <div className="w-[120px] h-[45px]  absolute right-0">
          <DefButton
            type="submit"
            className="text-button1"
            btnColor="cyan"
            innerItem={"댓글 작성"}
          />
        </div>
      </div>
    </form>
  );
}
