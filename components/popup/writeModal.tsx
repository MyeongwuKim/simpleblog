"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { getDeliveryDomain, timeStamp } from "@/app/hooks/useUtil";
import { showGlobalToast } from "../providers/uiProvider";
import { Collection, Image as ImageType } from "@prisma/client";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import DefButton from "../ui/buttons/defButton";
import UploadButton from "../ui/buttons/uploadButton";
import Image from "next/image";
import { Card } from "flowbite-react";
import { LuFolders } from "react-icons/lu";
import InputField from "../ui/input/inputField";
import { fetchAllCollections } from "@/app/lib/fetchers/collections";
import LabelButton from "../ui/buttons/labelButton";
import { IoMdSettings } from "react-icons/io";
import { useInView } from "react-intersection-observer";

interface WriteModalProps {
  title: string;
  preview: string | null;
  thumbnail: string | null;
  collection: string | null;
  onClose: (value: unknown) => void;
  show?: boolean;
}

export default function WriteModal({
  onClose,
  preview,
  thumbnail,
  title,
  collection,
  show = true,
}: WriteModalProps) {
  const [uploading, setUploading] = useState(false);
  const [useCollectionModal, setUseCollectionModal] = useState<boolean>(false);
  const [collectionData, setCollectionData] = useState<string | null>(
    collection
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [writeThumbnail, setWriteThumbnail] = useState<string | null>(
    thumbnail && getDeliveryDomain(thumbnail, "public")
  );

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
    { imageId: string; width?: number; height?: number }
  >({
    mutationFn: async (formData) => {
      const result = await (
        await fetch("/api/image", {
          method: "POST",
          body: JSON.stringify({ ...formData }),
        })
      ).json();
      if (!result.ok) throw new Error(result.error);
      return result;
    },
  });

  const handleFileSelect = async (file: File | null) => {
    const getImageSize = (
      file: File
    ): Promise<{ width: number; height: number }> =>
      new Promise((resolve, reject) => {
        const objectUrl = URL.createObjectURL(file);
        const img = new window.Image();

        img.onload = () => {
          resolve({
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
          URL.revokeObjectURL(objectUrl);
        };

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("이미지 크기를 읽을 수 없습니다."));
        };

        img.src = objectUrl;
      });

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
        //원본 이미지의 넓이 높이 추출
        const { width, height } = await getImageSize(file);

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

        await imageMutate.mutateAsync({ imageId: id, width, height });
        setWriteThumbnail(getDeliveryDomain(id, "public"));
        setUploading(false);
      } catch {
        setUploading(false);
        showGlobalToast(true, "이미지 업로드중 실패하였습니다", 1);
      }
    }
  };

  return (
    <>
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
                  onChange={(e) =>
                    handleFileSelect(e.target.files?.[0] ?? null)
                  }
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
                      base: "border-0 shadow-none",
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
                <div className="mt-4">
                  <div className="h-12">
                    {collectionData ? (
                      <div className="flex w-full h-full overflow-hidden  bg-transparent">
                        <div
                          className="rounded-lg rounded-r-none flex-1 px-4 py-3
    text-text1 select-text border-1 border-border1 border-r-0"
                        >
                          {collectionData.split(",")[1]}
                        </div>

                        <DefButton
                          btnColor="cyan"
                          type="button"
                          onClickEvt={() => setUseCollectionModal(true)}
                          innerItem={
                            <IoMdSettings className="text-button1"></IoMdSettings>
                          }
                          className="rounded-l-none
          flex items-center justify-center w-[55px] h-12 text-white"
                        />
                      </div>
                    ) : (
                      <DefButton
                        className=" border-2 border-gray-300 bg-gray-50 
                        hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 
                        dark:hover:border-gray-500 dark:hover:bg-gray-600 text-cyan-500"
                        btnColor="black"
                        innerItem={
                          <div className="flex gap-4 items-center">
                            <LuFolders />
                            <span>컬렉션 추가하기</span>
                          </div>
                        }
                        onClickEvt={() => setUseCollectionModal(true)}
                      />
                    )}
                  </div>

                  <div
                    className={`mt-2 flex justify-end ${
                      !collectionData && "invisible"
                    }`}
                  >
                    <LabelButton
                      color="red"
                      className="underline relative w-auto"
                      innerItem="컬렉션 삭제"
                      onClickEvt={() => setCollectionData(null)}
                    />
                  </div>
                </div>
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
                  onClickEvt={() =>
                    onClose({
                      thumbnail: extractThumbnail(),
                      collection: collectionData,
                    })
                  }
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {useCollectionModal && (
        <CollectionModal
          defaultValue={collectionData}
          onClose={(result) => {
            setUseCollectionModal(false);
            if (result) setCollectionData(result);
          }}
        />
      )}
    </>
  );
}

interface CollectionModalProps {
  onClose: (result: string | null) => void;
  defaultValue: string | null;
}

function CollectionModal({ onClose, defaultValue }: CollectionModalProps) {
  const queryClient = useQueryClient();
  const scrollBar = useRef<HTMLDivElement>(null);
  const [newCollection, setNewCollection] = useState("");
  const [collecionData, setCollecionData] = useState<string | null>(
    defaultValue
  );
  const { data: resCollecitonData } = useQuery<QueryResponse<Collection[]>>({
    queryKey: ["collections", "all"],
    queryFn: () => fetchAllCollections("all"),
  });
  const { mutate } = useMutation<
    QueryResponse<Collection[]>,
    Error,
    void,
    {
      previous?: QueryResponse<Collection[]>;
    }
  >({
    mutationFn: async () => {
      const result = await (
        await fetch("/api/collections", {
          method: "POST",
          body: JSON.stringify({ slug: newCollection }),
        })
      ).json();
      if (!result.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      setNewCollection("");
      //queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["collections", "all"],
      });

      const previous = queryClient.getQueryData<QueryResponse<Collection[]>>([
        "collections",
        "all",
      ]);

      const optimisticCollection: Collection = {
        id: `optimistic-${Date.now()}`,
        slug: newCollection,
        title: newCollection,
        thumbnail: null,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      queryClient.setQueryData<QueryResponse<Collection[]>>(
        ["collections", "all"],
        (old) => {
          if (!old) {
            return {
              ok: true,
              error: "",
              data: [optimisticCollection],
            };
          }

          return {
            ...old,
            data: [...old.data, optimisticCollection],
          };
        }
      );

      requestAnimationFrame(scrollToBottom);

      setCollecionData(`optimistic-${Date.now()}` + "," + newCollection);

      return { previous };
    },
    onError: (error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData<QueryResponse<Collection[]>>(
          ["collections", "all"],
          (old) => {
            return context?.previous;
          }
        );
      }
      showGlobalToast(true, error.message, 1);
    },
  });

  const scrollToBottom = useCallback(() => {
    const el = scrollBar.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [resCollecitonData]);

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[99] flex items-center justify-center dark:bg-[rgba(0,0,0,0.85)] bg-[rgba(249,249,249,0.85)]"
      >
        {/* modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="w-[360px] max-h-[50vh] rounded-xl bg-background1 shadow-xl flex flex-col">
            {/* header */}
            <div className="border-b-2 border-border1 p-6">
              <h2 className="text-lg font-bold">컬렉션 설정</h2>
            </div>

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newCollection.length <= 0) {
                  showGlobalToast(true, "컬렉션 이름을 입력해주세요.", 1);
                  return;
                }
                mutate();
              }}
              className="px-6 pb-4 flex items-center gap-2 mt-4"
            >
              <InputField
                placeholder="새로운 컬렉션을 입력하세요"
                size="sm"
                type="text"
                className="flex-1 min-w-0"
                value={newCollection}
                onChange={(e) => setNewCollection(e.target.value)}
              />
              <DefButton
                type="submit"
                className="text-button1 h-11 w-[45px]"
                btnColor="cyan"
                innerItem={"+"}
              />
            </form>

            <div
              ref={scrollBar}
              className="mx-6 mb-4 overflow-y-auto rounded-md border-2 border-border1 h-[312px]"
            >
              {resCollecitonData?.data.map((item) => {
                const slug = collecionData?.split(",")[1];
                const isSelected = slug === item.slug;

                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => setCollecionData(item.id + "," + item.slug)}
                    className={`w-full text-left px-4 py-3
          border-b-2 border-border1 transition 
          ${
            isSelected
              ? "bg-cyan-300 dark:bg-cyan-500 text-text1"
              : "text-text2 "
          }`}
                  >
                    {item.slug}
                  </button>
                );
              })}
            </div>
            <div className="border-t-2 border-border1 p-6 flex gap-2 justify-end">
              <DefButton
                className="h-11 hover:bg-bg-page3 text-cyan-500"
                btnColor="black"
                innerItem={"취소"}
                onClickEvt={() => onClose(null)}
              />
              <DefButton
                disabled={!collecionData}
                className="text-button1 h-11"
                btnColor="cyan"
                innerItem={"선택"}
                onClickEvt={() => onClose(collecionData)}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
