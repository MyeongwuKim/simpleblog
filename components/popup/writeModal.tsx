"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { getDeliveryDomain, timeStamp } from "@/app/hooks/useUtil";
import { showGlobalToast } from "../providers/uiProvider";
import { Image as ImageType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import DefButton from "../ui/buttons/defButton";
import UploadButton from "../ui/buttons/uploadButton";
import Image from "next/image";
import { Card } from "flowbite-react";

interface WriteModalProps {
  title: string;
  preview: string | null;
  thumbnail: string | null;
  onClose: (value: unknown) => void;
  show?: boolean;
}

export default function WriteModal({
  onClose,
  preview,
  thumbnail,
  title,
  show = true,
}: WriteModalProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [writeThumbnail, setWriteThumbnail] = useState<string | null>(
    thumbnail
  );

  useEffect(() => {
    if (thumbnail) {
      setWriteThumbnail(getDeliveryDomain(thumbnail, "public"));
    }
  }, [thumbnail]);

  const extractThumbnail = () => {
    let thumb: string | null = null;
    if (process.env.NEXT_PUBLIC_DEMO) {
      const demoThumb = writeThumbnail?.match(
        /https:\/\/picsum\.photos\/[^\)\s]+/
      );
      thumb = demoThumb ? demoThumb[0] : null;
    } else {
      const realThumb = writeThumbnail?.match(
        /imagedelivery\.net\/[^\/]+\/([^\/]+)/
      );
      thumb = realThumb ? realThumb[1] : null;
    }
    return thumb;
  };

  const imageMutate = useMutation<
    QueryResponse<ImageType>,
    Error,
    { imageId: string }
  >({
    mutationFn: async (id) => {
      const result = await (
        await fetch("/api/image", {
          method: "POST",
          body: JSON.stringify({ ...id }),
        })
      ).json();
      if (!result.ok) throw new Error(result.error);
      return result;
    },
  });

  const handleFileSelect = async (file: File | null) => {
    if (file) {
      setUploading(true);
      const previewUrl = URL.createObjectURL(file);
      setWriteThumbnail(previewUrl);

      if (process.env.NEXT_PUBLIC_DEMO) {
        const randomImg = `https://picsum.photos/seed/${Date.now()}/600/400`;
        setWriteThumbnail(randomImg);
        await imageMutate.mutateAsync({ imageId: randomImg });
        setUploading(false);
        return;
      }
      try {
        const { uploadURL } = await (
          await fetch(`/api/upload`, { method: "POST" })
        ).json();

        const form = new FormData();
        form.append(
          "file",
          file,
          `${process.env.NODE_ENV}_simpleblog_${timeStamp()}`
        );

        const {
          result: { id },
        } = await (
          await fetch(uploadURL, { method: "POST", body: form })
        ).json();

        await imageMutate.mutateAsync({ imageId: id });
        setWriteThumbnail(getDeliveryDomain(id, "public"));
        setUploading(false);
      } catch {
        setUploading(false);
        showGlobalToast(true, "이미지 업로드중 실패하였습니다", 1);
      }
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[99] flex items-center justify-center 
                     dark:bg-[rgba(0,0,0,0.85)] bg-[rgba(249,249,249,0.85)]"
        >
          <motion.div
            key="content"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="dark:bg-background1 bg-background1 rounded-md shadow-lg max-w-md w-full"
          >
            {/* Header */}
            <div className="border-b-2 border-border1 p-6">
              <h2 className="text-lg font-bold">포스트 미리보기</h2>
            </div>

            {/* Body */}
            <div className="p-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
              />
              <div className="relative w-full mb-4 flex justify-end gap-2 [&_span]:text-lg [&_span]:text-text3">
                {writeThumbnail && (
                  <>
                    <span
                      className="cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      수정
                    </span>
                    <span
                      className="cursor-pointer"
                      onClick={() => setWriteThumbnail(null)}
                    >
                      제거
                    </span>
                  </>
                )}
              </div>

              <Card
                theme={{
                  root: {
                    base: "border-0",
                    children:
                      "flex h-full flex-col justify-center gap-2 p-2 bg-background1",
                  },
                }}
                className="w-full h-full"
                renderImage={() => (
                  <div className="relative bg-background2 w-full h-[240px] flex justify-center items-center">
                    {writeThumbnail ? (
                      <Image
                        fill
                        src={writeThumbnail}
                        alt={title}
                        priority
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover"
                      />
                    ) : (
                      <UploadButton onSelect={handleFileSelect} />
                    )}
                  </div>
                )}
              >
                <div
                  id="CardItemWrapper"
                  className="flex flex-col flex-auto gap-1 mt-4"
                >
                  <h4 className="text-[1rem] text-box font-bold tracking-tight text-gray-900 dark:text-white">
                    {title}
                  </h4>
                  <p className="line-clamp-1 text-text2 leading-[1.5em]">
                    {preview}
                  </p>
                </div>
              </Card>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-border1 p-6 flex gap-2 justify-end">
              <DefButton
                className="h-11 hover:bg-bg-page3 text-cyan-500"
                btnColor="black"
                innerItem={"취소"}
                disabled={uploading}
                onClickEvt={() => onClose(0)}
              />
              <DefButton
                className="text-button1 h-11"
                btnColor="cyan"
                innerItem={"작성"}
                disabled={uploading}
                onClickEvt={() => onClose(extractThumbnail())}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
