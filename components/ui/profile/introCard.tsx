"use client";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DefButton from "../buttons/defButton";
import LabelButton from "../buttons/labelButton";
import { getDeliveryDomain, timeStamp } from "@/app/hooks/useUtil";
import { useUI } from "@/components/providers/uiProvider";
import InputField from "../input/inputField";
import { profileMutate, profileQuery } from "./query";

export default function IntroCard() {
  const { openToast } = useUI();
  const [isEdit, setIsEdit] = useState(false);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profileResult, isLoading: profileLoading } = profileQuery();

  const { mutate } = profileMutate({
    onSuccessCallback: (result) => {
      setUploading(false);
      if (result?.data?.profileImg) {
        setProfileImg(getDeliveryDomain(result.data.profileImg, "public"));
      }
    },
    onError: (error) => {
      openToast(true, error.message, 1);
      setUploading(false);
    },
  });

  useEffect(() => {
    if (profileResult?.ok && profileResult?.data?.profileImg) {
      setProfileImg(getDeliveryDomain(profileResult.data.profileImg, "public"));
    }
  }, [profileResult]);

  const renderMap = useMemo(
    () => ({
      edit: (
        <EditIntro
          _title={profileResult?.data?.title || ""}
          _intro={profileResult?.data?.introduce || ""}
          onConfirm={({ title, intro }) => {
            mutate({ form: "intro", title, introduce: intro });
            setIsEdit(false);
          }}
        />
      ),
      read: (
        <ReadIntro
          title={profileResult?.data?.title || ""}
          intro={profileResult?.data?.introduce || ""}
          onEdit={() => setIsEdit(true)}
        />
      ),
    }),
    [profileResult]
  );

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemove = useCallback(async () => {
    if (profileResult?.data.profileImg) {
      fetch(`/api/upload?id=${profileResult?.data.profileImg}`, {
        method: "DELETE",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      mutate({ form: "profileimg", profileImg: null as any });
      setProfileImg(null);
    }
  }, [profileResult?.data.profileImg]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ✅ 미리보기
      const previewUrl = URL.createObjectURL(file);
      setProfileImg(previewUrl);
      setUploading(true);

      try {
        const { uploadURL } = await (
          await fetch(`/api/upload`, { method: "POST" })
        ).json();

        const form = new FormData();
        form.append(
          "file",
          file as any,
          `${process.env.NODE_ENV}_simpleblog_profile_${timeStamp()}`
        );

        const {
          result: { id },
        } = await (
          await fetch(uploadURL, {
            method: "POST",
            body: form,
          })
        ).json();

        mutate({ profileImg: id, form: "profileimg" });
      } catch {
        setUploading(false);
        openToast(true, "이미지 업로드중 실패하였습니다", 1);
      }
    }
  };

  if (profileLoading) return <div></div>;

  return (
    <div className="w-full h-full flex flex-row flex-auto max-sm:flex-col sm:mb-10">
      <div className="flex flex-col items-center pr-8">
        <div className="w-[128px] h-[192px] rounded-md relative mb-4 overflow-hidden flex items-center justify-center ">
          {profileImg ? (
            <Image
              className="w-full h-full object-cover"
              src={profileImg}
              alt="profile"
              fill
            />
          ) : uploading ? (
            <span className="text-gray-500 text-sm">업로드 중...</span>
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        <div className="w-[140px] h-[40px] mb-4">
          <DefButton
            className="text-button1"
            btnColor="cyan"
            innerItem={uploading ? "업로드중.." : "업로드"}
            onClickEvt={handleUploadClick}
            disabled={uploading}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="w-[140px] h-[40px]">
          <DefButton
            className="hover:bg-bg-page3"
            btnColor="black"
            innerItem="이미지 제거"
            onClickEvt={handleRemove}
            disabled={uploading}
          />
        </div>
      </div>

      <div className="border-r-[1px] border-border1 max-sm:border-b-[1px] max-sm:mt-6 max-sm:mb-6" />
      <div className="px-8 flex flex-auto flex-col gap-2">
        {isEdit ? renderMap.edit : renderMap.read}
      </div>
    </div>
  );
}

function EditIntro({
  onConfirm,
  _intro,
  _title,
}: {
  onConfirm: ({ title, intro }: { title: string; intro: string }) => void;
  _title: string;
  _intro: string;
}) {
  const [title, setTitle] = useState<string>(_title);
  const [intro, setIntro] = useState<string>(_intro);

  return (
    <>
      <InputField
        size="md"
        type="text"
        maxLength={30}
        className="h-[58px]"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <InputField
        size="md"
        type="text"
        maxLength={200}
        className="min-h-[58px]"
        value={intro}
        onChange={(e) => setIntro(e.target.value)}
      />
      <div className="flex justify-end">
        <DefButton
          className="w-[80px] h-[40px] text-button1"
          btnColor="cyan"
          innerItem="확인"
          onClickEvt={() => onConfirm({ title, intro })}
        />
      </div>
    </>
  );
}

function ReadIntro({
  onEdit,
  intro,
  title,
}: {
  onEdit: () => void;
  title: string;
  intro: string;
}) {
  return (
    <>
      <div className={`h-[58px] ${title.length <= 0 && "hidden"}`}>
        <h1 className="text-text1 text-3xl">{title}</h1>
      </div>
      <div className={`h-[58px] ${title.length <= 0 && "hidden"}`}>
        <p className="text-text2">{intro}</p>
      </div>

      <div className="h-[40px] w-[40px]">
        <LabelButton
          color="cyan"
          className="underline h-full w-full"
          innerItem="수정"
          onClickEvt={onEdit}
        />
      </div>
    </>
  );
}
