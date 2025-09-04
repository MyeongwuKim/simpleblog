"use client";

import { Card, createTheme } from "flowbite-react";
import { FaGithub, FaInstagram } from "react-icons/fa6";
import { RiNotionFill } from "react-icons/ri";
import { getDeliveryDomain } from "@/app/hooks/useUtil";
import Image from "next/image";

import ReactMD from "@/components/write/reactMD";
import DefButton from "../buttons/defButton";
import { useCallback, useState } from "react";
import { TextAreaField } from "../input/textAreaField";

import { useUI } from "@/components/providers/uiProvider";
import { useSession } from "next-auth/react";
import { useProfileMutate } from "../profile/query";
import { Profile } from "@prisma/client";

const mainTheme = createTheme({
  card: {
    root: {
      base: "flex rounded-lg border-0 bg-background1 shadow-md max-sm:items-center min-h-72 h-auto ",
      children: "p-4",
      horizontal: {
        off: "flex-col",
        on: "max-sm:flex-col  flex-row",
      },
      href: "hover:bg-gray-100 dark:hover:bg-gray-700",
    },
    img: {
      base: "",
      horizontal: {
        off: "",
        on: "h-96 w-72 rounded-t-lg object-cover max-sm:h-auto max-sm:w-48 max-sm:rounded-none rounded-l-lg max-sm:mt-4 ",
      },
    },
  },
});

export function ProfileItem({ profile }: { profile: Profile | null }) {
  const [localProfile, setLocalProfile] = useState<Profile | null>(profile);

  const normalizedUrl = (url: string) => {
    return url.startsWith("http") ? url : `https://${url}`;
  };
  const { openToast } = useUI();

  const { mutate } = useProfileMutate({
    onErrorCallback(error) {
      openToast(true, error.message, 1);
    },
    onSuccessCallback({ ok, data }) {
      if (ok) setLocalProfile(data);
    },
  });

  return (
    <>
      <Card
        clearTheme={{ root: true, img: true }}
        theme={mainTheme.card}
        className="w-full"
        renderImage={() => {
          return (
            <div className="relative h-72 w-64 rounded-t-lg  max-sm:w-48 max-sm:h-48 max-sm:rounded-none rounded-l-lg max-sm:mt-4">
              {localProfile?.profileImg ? (
                <Image
                  src={getDeliveryDomain(localProfile?.profileImg, "public")}
                  alt="profile"
                  sizes="100vw, 400px"
                  fill // 부모 크기에 맞춤
                  className="object-cover  rounded-t-lg  max-sm:rounded-none rounded-l-lg "
                  priority
                />
              ) : (
                <div
                  className="w-full h-full
              rounded-t-lg  max-sm:rounded-none rounded-l-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500"
                >
                  No Image
                </div>
              )}
            </div>
          );
        }}
        horizontal
      >
        <div className="grid grid-rows-[auto_auto_40px]   w-full h-full gap-4">
          <div className="font-bold text-3xl  break-all ">
            {localProfile?.title}
          </div>
          <p className="font-normal text-text3 break-all">
            {localProfile?.introduce}
          </p>
          <div className="flex w-full gap-2">
            <a
              href={normalizedUrl(localProfile?.instagram ?? "")}
              target="_blank"
              className={`${localProfile?.instagram ?? "hidden"}`}
              rel="noopener noreferrer"
            >
              <FaInstagram className={`h-[36px] w-[36px] text-text1`} />
            </a>
            <a
              href={normalizedUrl(localProfile?.github ?? "")}
              target="_blank"
              className={`${localProfile?.github ?? "hidden"}`}
              rel="noopener noreferrer"
            >
              <FaGithub className={`h-[36px] w-[36px] text-text1`} />
            </a>
            <a
              href={normalizedUrl(localProfile?.notion ?? "")}
              className={`${localProfile?.notion ?? "hidden"}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <RiNotionFill className={`h-[36px] w-[36px] text-text1`} />
            </a>
          </div>
        </div>
      </Card>
      <div className="text-2xl py-10 font-bold text-text2 text-center">
        소개
      </div>
      <IntroContentForm mutate={mutate} content={localProfile?.content ?? ""} />
    </>
  );
}

function IntroContentForm({
  content,
  mutate,
}: {
  content: string;
  mutate: ReturnType<typeof useProfileMutate>["mutate"];
}) {
  const { data: session } = useSession();
  const [isModify, setIsModify] = useState<boolean>(false);
  const [introContent, setIntroContent] = useState<string>(content);

  const onTextAreaChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIntroContent(e.target.value);
    },
    []
  );

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
        <ReactMD doc={content} />
      )}
    </div>
  );
}
