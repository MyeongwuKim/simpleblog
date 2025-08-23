"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import DefButton from "../buttons/defButton";

import LabelButton from "../buttons/labelButton";
import { timeStamp } from "@/app/hooks/useUtil";
import { useUI } from "@/components/providers/uiProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Profile } from "@prisma/client";
import InputField from "../input/inputField";
import { fetchProfile } from "@/app/lib/fetchers/profile";

export default function IntroCard() {
  const { openToast } = useUI();
  const [isEdit, setIsEdit] = useState(false);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false); // ✅ 업로드 상태
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    data: profileResult,
    isError: slugError,
    isLoading: profileLoading,
  } = useQuery<QueryResponse<Profile>>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });

  const { mutate } = useMutation<
    QueryResponse<Profile>,
    Error,
    Partial<Profile> & { form: "profileimg" | "intro" | "social" | "cotent" }
  >({
    mutationFn: async (data) => {
      const result = await (
        await fetch(`/api/profile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data), // ✅ data 전달
        })
      ).json();
      if (!result.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: ({ data }) => {
      setUploading(false); // 업로드 완료 후 상태 해제
    },
    onError: () => {
      setUploading(false);
      openToast(true, "프로필 저장 실패", 1);
    },
  });

  const renderMap = {
    edit: <EditIntro onConfirm={() => setIsEdit(false)} />,
    read: <ReadIntro onEdit={() => setIsEdit(true)} />,
  };

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemove = useCallback(() => {
    console.log("remove!");
    setProfileImg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfileImg(previewUrl);
      setUploading(true); // ✅ 업로드 시작
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

  return (
    <div className="w-full h-full flex flex-row flex-auto">
      <div className="flex flex-col items-center border-r-[1px] border-border1 pr-8">
        <div className="w-[128px] h-[192px] rounded-md relative mb-4 overflow-hidden flex items-center justify-center">
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
            // 업로드 중에는 버튼 비활성화
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

      <div className="px-8 flex flex-auto flex-col gap-2">
        {isEdit ? renderMap.edit : renderMap.read}
      </div>
    </div>
  );
}

function EditIntro({ onConfirm }: { onConfirm: () => void }) {
  return (
    <>
      <InputField size="md" type="text" maxLength={30} className="h-[58px]" />
      <InputField
        size="md"
        type="text"
        maxLength={200}
        className="min-h-[58px]"
      />
      <div className="flex justify-end">
        <DefButton
          className="hover:bg-bg-page3  w-[80px] h-[40px] text-button1"
          btnColor="cyan"
          innerItem="확인"
          onClickEvt={onConfirm}
        />
      </div>
    </>
  );
}

function ReadIntro({ onEdit }: { onEdit: () => void }) {
  return (
    <>
      <div className="h-[58px]">
        <h1 className="text-text1 text-3xl ">김명우웁니다1</h1>
      </div>
      <div className="min-h-[58px]">
        <p className="text-text2">안녕하세요, 블로그 운영자 김명우입니다 👋</p>
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
