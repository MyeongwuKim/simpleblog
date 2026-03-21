"use client";
import { fetchCollectionDetail } from "@/app/lib/fetchers/collections";
import DefButton from "@/components/ui/buttons/defButton";
import InputField from "@/components/ui/input/inputField";
import CollectionDetailItem from "@/components/ui/items/collectionDetailItem";
import { Collection } from "@prisma/client";
import {
  InfiniteData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useUI } from "@/components/providers/uiProvider";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface CollectionBodyProps {
  collectionId: string;
}
type MutatePayloadType = {
  title?: string;
  items?: {
    postId: string;
    order: number;
  }[];
};
export default function CollectionsBody({ collectionId }: CollectionBodyProps) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const route = useRouter();
  const { openToast, openModal } = useUI();

  const {
    data: collectionData,
  } = useQuery<QueryResponse<{ title: string; items: CollectionItemType[] }>>({
    queryKey: ["collections", collectionId],
    queryFn: () => fetchCollectionDetail(collectionId),
    staleTime: 600 * 1000,
  });

  const { mutate: updateMutate } = useMutation<
    QueryResponse<Collection>,
    Error,
    MutatePayloadType
  >({
    mutationFn: async (payload) => {
      const result = await (
        await fetch(`/api/collections/${collectionId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
      ).json();

      if (!result.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: (res) => {
      setIsModify(false);

      const updated = res.data;

      function reorderCollectionItems<T extends { id: string }>(
        items: T[],
        orders: { postId: string; order: number }[]
      ): T[] {
        const orderMap = new Map(orders.map((o) => [o.postId, o.order]));

        return [...items].sort((a, b) => {
          const aOrder = orderMap.get(a.id);
          const bOrder = orderMap.get(b.id);

          if (aOrder == null && bOrder == null) return 0;
          if (aOrder == null) return 1;
          if (bOrder == null) return -1;

          return aOrder - bOrder;
        });
      }

      queryClient.setQueryData<
        QueryResponse<{
          title: string;
          items: CollectionItemType[];
        }>
      >(["collections", collectionId], (old) => {
        if (!old?.data?.items) return old;

        return {
          ...old,
          data: {
            ...old.data,
            items: reorderCollectionItems(
              old.data.items,
              updated.items // ← 서버에서 온 order 정보
            ),
          },
        };
      });

      queryClient.setQueryData<InfiniteData<InfiniteResponse<Collection>>>(
        ["collections"],
        (old) => {
          if (!old) return old;

          let movedItem: Collection | null = null;

          // 1️⃣ 모든 페이지에서 제거 + 원본 객체 보존
          const cleanedPages = old.pages.map((page) => {
            const remaining = page.data.filter((col) => {
              if (col.id === updated.id) {
                movedItem = {
                  ...col, // ✅ 기존 shape 유지 (posts 포함)
                  title: updated.title,
                  thumbnail: updated.thumbnail,
                  updatedAt: updated.updatedAt,
                };
                return false;
              }
              return true;
            });

            return {
              ...page,
              data: remaining,
            };
          });

          // ❗ 혹시 리스트에 없던 경우 (안전장치)
          if (!movedItem) {
            return old;
          }

          // 2️⃣ 첫 페이지 맨 앞에 prepend
          const firstPage = cleanedPages[0];

          const newFirstPage = {
            ...firstPage,
            data: [movedItem, ...firstPage.data],
          };

          return {
            ...old,
            pages: [newFirstPage, ...cleanedPages.slice(1)],
          };
        }
      );
    },
  });

  const { mutate: deleteMutate } = useMutation<{ ok: boolean }, Error>({
    mutationFn: async () => {
      const result = await (
        await fetch(`/api/collections/${collectionId}`, {
          method: "DELETE",
        })
      ).json();

      if (!result.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.setQueryData<InfiniteData<InfiniteResponse<Collection>>>(
        ["collections"],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.filter((col) => col.id !== collectionId),
            })),
          };
        }
      );
      openToast(false, "성공적으로 삭제하였습니다.", 1);
      route.replace("/collections");
    },
  });

  const [originTitle, setOriginTitle] = useState("");
  const [originItems, setOriginItems] = useState<CollectionItemType[]>([]);

  const [isModify, setIsModify] = useState<boolean>(false);
  const [collectionTitle, setCollectionTitle] = useState<string>(
    collectionData?.data.title ?? ""
  );
  const [items, setItems] = useState<CollectionItemType[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (collectionData?.data.items) {
      setItems(collectionData.data.items);
    }
    if (collectionData?.data) {
      setOriginTitle(collectionData.data.title);
      setOriginItems(collectionData.data.items);
      setItems(collectionData.data.items);
      setCollectionTitle(collectionData.data.title);
    }
  }, [collectionData]);

  useEffect(() => {
    if (isModify) inputRef.current?.focus();
  }, [isModify]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };
  const isTitleChanged = originTitle !== collectionTitle;
  const isOrderChanged = useMemo(() => {
    if (originItems.length !== items.length) return true;

    return originItems.some((item, idx) => item.id !== items[idx]?.id);
  }, [originItems, items]);

  const hasChanges = isTitleChanged || isOrderChanged;
  const handleApply = () => {
    if (!hasChanges) {
      setIsModify(false);
      return;
    }

    const payload: MutatePayloadType = {};

    if (isTitleChanged) {
      payload.title = collectionTitle;
    }

    if (isOrderChanged) {
      payload.items = items.map((item, idx) => ({
        postId: item.id,
        order: idx,
      }));
    }

    updateMutate(payload);
  };

  const deleteCollection = async () => {
    const result = await openModal("CONFIRM", {
      title: "컬렉션 삭제",
      msg: "컬렉션을 지우시겠습니까?",
      btnMsg: ["취소", "확인"],
    });
    if (result) deleteMutate();
  };

  return (
    <div className="flex flex-col items-stretch w-full gap-4 mt-4">
      <InputField
        ref={inputRef}
        size="lg"
        type="text"
        readOnly={!isModify}
        onChange={(e) => setCollectionTitle(e.target.value)}
        defaultValue={collectionTitle}
        className={`w-full h-20 ${!isModify && "pointer-events-none"}`}
      />
      <div className="flex justify-end h-[40px]">
        {session &&
          (isModify ? (
            <DefButton
              type="submit"
              className="text-button1 w-[80px] h-[40px]"
              btnColor="cyan"
              innerItem="적용"
              onClickEvt={handleApply}
            />
          ) : (
            <div className="flex gap-2 h-[40px] [&_span]:text-lg [&_span]:text-text3">
              <span
                className="cursor-pointer"
                onClick={() => setIsModify(true)}
              >
                수정
              </span>
              <span className="cursor-pointer" onClick={deleteCollection}>
                삭제
              </span>
            </div>
          ))}
      </div>
      <div className={`${isModify && "border-2 border-border1 p-4"}`}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-16">
              {items.map((item, i) => (
                <CollectionDetailItem
                  key={item.id}
                  id={item.id} //
                  isModify={isModify}
                  order={i}
                  detailData={item}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
