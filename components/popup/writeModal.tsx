"use client";
import {
  Card,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import DefButton from "../ui/buttons/defButton";
import { useEffect, useRef, useState } from "react";
import { getDeliveryDomain, timeStamp } from "@/app/hooks/useUtil";
import Image from "next/image";
import UploadButton from "../ui/buttons/uploadButton";
import { showGlobalToast } from "../providers/uiProvider";
import { motion } from "framer-motion";

interface WriteModalProps {
  title: string;
  preview: string | null;
  thumbnail: string | null;
  onClose: (value: number | string | null) => void;
}

export default function WriteModal({
  onClose,
  preview,
  thumbnail,
  title,
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

  const extractTumbnail = () => {
    let thumb: string | null = null;

    if (process.env.NEXT_PUBLIC_DEMO) {
      const demoThumb = writeThumbnail?.match(
        /https:\/\/picsum\.photos\/[^\)\s]+/
      );
      thumb = demoThumb ? demoThumb[1] : null;
    } else {
      const realThumb = writeThumbnail?.match(
        /imagedelivery\.net\/[^\/]+\/([^\/]+)/
      );
      thumb = realThumb ? realThumb[1] : null;
    }
    return thumb;
  };

  const handleFileSelect = async (file: File | null) => {
    if (file) {
      setUploading(true);

      const previewUrl = URL.createObjectURL(file);
      setWriteThumbnail(previewUrl);

      if (process.env.NEXT_PUBLIC_DEMO) {
        const randomImg = `https://picsum.photos/seed/${Date.now()}/600/400`;
        setWriteThumbnail(randomImg);
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
          `${process.env.NODE_ENV}_simpleblog_profile_${timeStamp()}`
        );

        const {
          result: { id },
        } = await (
          await fetch(uploadURL, { method: "POST", body: form })
        ).json();

        setWriteThumbnail(getDeliveryDomain(id, "public"));
        setUploading(false);
      } catch {
        setUploading(false);
        showGlobalToast(true, "이미지 업로드중 실패하였습니다", 1);
      }
    }
  };

  return (
    <Modal
      id="alert-modal"
      theme={{
        root: {
          show: {
            on: "dark:bg-[rgba(0,0,0,0.85)] bg-[rgba(249,249,249,0.85)]",
          },
        },
        content: {
          inner: "dark:bg-background1 bg-background1 rounded-md",
        },
        header: {
          base: "border-border1 border-b-2 p-6 ",
          close: { base: "hidden" },
        },
        footer: {
          base: "border-border1  p-6 flex gap-2",
        },
      }}
      show={true}
      size="md"
    >
      {/* ✅ motion.div로 애니메이션 추가 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <ModalHeader>포스트 미리보기</ModalHeader>
        <ModalBody>
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
        </ModalBody>
        <ModalFooter>
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
            onClickEvt={() => onClose(extractTumbnail())}
          />
        </ModalFooter>
      </motion.div>
    </Modal>
  );
}
