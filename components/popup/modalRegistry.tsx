"use client";

import type { ReactNode } from "react";
import AlertModal from "./alertModal";
import WriteModal from "./writeModal";
import type {
  ModalItem,
  ModalPropsMap,
  ModalResultMap,
  ModalType,
} from "@/redux/reducer/modalReducer";

export type ModalComponentProps<T extends ModalType> = ModalPropsMap[T] & {
  onClose: (value: ModalResultMap[T]) => void;
  show?: boolean;
};

const modalRegistry = {
  CONFIRM: (props: ModalComponentProps<"CONFIRM">) => <AlertModal {...props} />,
  WRITE: (props: ModalComponentProps<"WRITE">) => <WriteModal {...props} />,
} satisfies {
  [K in ModalType]: (props: ModalComponentProps<K>) => ReactNode;
};

export const renderModal = <T extends ModalType>(
  modal: ModalItem<T>,
  onClose: (value: ModalResultMap[T]) => void
) => {
  const renderer = modalRegistry[modal.type] as unknown as (
    props: ModalComponentProps<T>
  ) => ReactNode;

  const modalProps = {
    ...modal.props,
    onClose,
  } as unknown as ModalComponentProps<T>;

  return renderer(modalProps);
};
