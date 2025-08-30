"use client";
import { useState } from "react";
import { FaGithub, FaInstagram } from "react-icons/fa6";
import { RiNotionFill } from "react-icons/ri";
import LabelButton from "../buttons/labelButton";
import InputField from "../input/inputField";
import DefButton from "../buttons/defButton";
import { useProfileMutate, useProfileQuery } from "./query";
import { useUI } from "@/components/providers/uiProvider";

export default function SocialForm() {
  const [isEdit, setIsEdit] = useState(false);
  const { data: profileResult, isLoading: profileLoading } = useProfileQuery();

  if (profileLoading) return <div></div>;

  const renderMap = {
    edit: (
      <EditSocialForm
        github={profileResult?.data?.github ?? ""}
        instagram={profileResult?.data?.instagram ?? ""}
        notion={profileResult?.data?.notion ?? ""}
        onConfirm={() => setIsEdit(false)}
      />
    ),
    read: (
      <ReadSocialForm
        github={profileResult?.data?.github ?? ""}
        instagram={profileResult?.data?.instagram ?? ""}
        notion={profileResult?.data?.notion ?? ""}
        onEdit={() => setIsEdit(true)}
      />
    ),
  };

  return (
    <div className="w-full h-auto">
      <div className="w-full h-auto relative pb-6 flex border-b-[1px] border-border1">
        <div className="max-w-[163px] w-full">
          <h3 className="text-text1 text-xl font-bold w-full">소셜설정</h3>
        </div>
        {isEdit ? renderMap.edit : renderMap.read}
      </div>
    </div>
  );
}

function EditSocialForm({
  onConfirm,
  github,
  instagram,
  notion,
}: {
  onConfirm: () => void;
  github: string;
  instagram: string;
  notion: string;
}) {
  const { openToast } = useUI();
  const [git, setGit] = useState(github);
  const [insta, setInsta] = useState(instagram);
  const [nt, setNt] = useState(notion);

  const { mutate } = useProfileMutate({
    onError: (error) => {
      openToast(true, error.message, 1);
    },
  });

  return (
    <form
      id="sub-form"
      onSubmit={(e) => {
        e.preventDefault(); // ✅ 브라우저 기본 submit 막기
        mutate({
          form: "social",
          github: git.length <= 0 ? null : git,
          instagram: insta.length <= 0 ? null : insta,
          notion: nt.length <= 0 ? null : nt,
        });
        onConfirm();
      }}
      className="flex gap-4 flex-col w-2/4"
    >
      <InputField
        size="md"
        type="text"
        icon={FaGithub}
        value={git}
        onChange={(e) => setGit(e.target.value)}
      />
      <InputField
        size="md"
        type="text"
        icon={FaInstagram}
        value={insta}
        onChange={(e) => setInsta(e.target.value)}
      />
      <InputField
        size="md"
        type="text"
        icon={RiNotionFill}
        value={nt}
        onChange={(e) => setNt(e.target.value)}
      />
      <div className="flex flex-row-reverse">
        <div className="w-[100px] h-[40px]">
          <DefButton
            type="submit"
            className="  text-button1"
            btnColor="cyan"
            innerItem="확인"
          />
        </div>
      </div>
    </form>
  );
}

function ReadSocialForm({
  onEdit,
  github,
  instagram,
  notion,
}: {
  onEdit: () => void;
  github: string;
  instagram: string;
  notion: string;
}) {
  return (
    <div
      id="sub-setting-view"
      className="flex relative w-full gap-2 justify-items-stretch"
    >
      <div className="w-full flex flex-col gap-2">
        <div
          className={`text-text3 ${
            github.length <= 0 && instagram.length <= 0 && notion.length <= 0
              ? ""
              : "hidden"
          }`}
        >
          등록된 소셜 정보가 없습니다.
        </div>
        <div
          className={`w-full flex text-text3 gap-2 items-center ${
            github.length <= 0 ? "hidden" : ""
          }`}
        >
          <FaGithub className="w-4 h-4" />
          <span>{github}</span>
        </div>
        <div
          className={`w-full flex text-text3 gap-2 items-center ${
            instagram.length <= 0 ? "hidden" : ""
          }`}
        >
          <FaInstagram className="w-4 h-4" />
          <span>{instagram}</span>
        </div>
        <div
          className={`w-full flex text-text3 gap-2 items-center ${
            notion.length <= 0 ? "hidden" : ""
          }`}
        >
          <RiNotionFill className="w-4 h-4" />
          <span>{notion}</span>
        </div>
      </div>

      <div className="w-[40px]">
        <LabelButton
          color="cyan"
          className="underline h-full w-full"
          innerItem="수정"
          onClickEvt={onEdit}
        />
      </div>
    </div>
  );
}
