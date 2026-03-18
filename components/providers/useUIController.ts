"use client";

import { useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch } from "@/redux/store/hooks";
import { addToast } from "@/redux/reducer/toastReducer";
import {
  addModal,
  ModalItem,
  ModalPropsMap,
  ModalResultMap,
  ModalType,
} from "@/redux/reducer/modalReducer";
import { modalManager } from "@/app/lib/modalManager";

export type UIController = {
  openToast: (isWarning: boolean, msg: string, time: number) => void;
  openModal: <T extends ModalType>(
    type: T,
    props: ModalPropsMap[T]
  ) => Promise<ModalResultMap[T]>;
};

const createModalItem = <T extends ModalType>(
  type: T,
  id: string,
  props: ModalPropsMap[T]
): ModalItem<T> =>
  ({
    type,
    id,
    props,
  }) as ModalItem<T>;

export default function useUIController(): UIController {
  const dispatch = useAppDispatch();

  const openToast = useCallback(
    (isWarning: boolean, msg: string, time: number) => {
      dispatch(addToast({ isWarning, msg, time }));
    },
    [dispatch]
  );

  const openModal = useCallback(
    <T extends ModalType>(
      type: T,
      props: ModalPropsMap[T]
    ): Promise<ModalResultMap[T]> => {
      const id = uuidv4();
      const modalItem = createModalItem(type, id, props);

      dispatch(addModal(modalItem));

      return modalManager.create<ModalResultMap[T]>(id);
    },
    [dispatch]
  );

  return useMemo(
    () => ({
      openToast,
      openModal,
    }),
    [openModal, openToast]
  );
}
