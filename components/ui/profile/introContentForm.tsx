"use client";
import ReactMD from "@/components/write/reactMD";
import DefButton from "../buttons/defButton";
import { useCallback, useState } from "react";
import { TextAreaField } from "../input/textAreaField";

import { useUI } from "@/components/providers/uiProvider";
import { useSession } from "next-auth/react";
import { useProfileMutate, useProfileQuery } from "./query";

export default function IntroContentForm() {
  const { openToast } = useUI();
  const { data: session } = useSession();
  const [isModify, setIsModify] = useState<boolean>(false);
  const { data: profileResult, isLoading: profileLoading } = useProfileQuery();
  const [introContent, setIntroContent] = useState<string>(
    profileResult?.data.content ?? ""
  );
  const { mutate } = useProfileMutate({
    onError: (error) => {
      openToast(true, error.message, 1);
    },
  });
  const onTextAreaChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      console.log(e.target.value);
      setIntroContent(e.target.value);
    },
    []
  );
  if (profileLoading) return;
  return (
    <div className="w-full h-full">
      <div className="w-full  h-[45px] relative mb-4">
        {session && (
          <div className={`w-[120px] h-full  absolute right-0`}>
            <DefButton
              className=" text-button1"
              btnColor={"cyan"}
              innerItem={isModify ? "수정 완료" : "소개 작성"}
              onClickEvt={() => {
                if (isModify) {
                  mutate({ form: "content", content: introContent });
                }
                setIsModify(!isModify);
              }}
            />
          </div>
        )}
      </div>
      {isModify ? (
        <div className="h-[300px]">
          <TextAreaField value={introContent} onChange={onTextAreaChange} />
        </div>
      ) : (
        <ReactMD doc={profileResult?.data.content ?? ""} />
      )}
    </div>
  );
}
