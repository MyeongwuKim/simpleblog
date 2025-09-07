// components/providers/UIProvider.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
} from "react";
import { v4 as uuidv4 } from "uuid";
import AlertModal from "../popup/alertModal";
import { addToast, removeToast } from "@/redux/reducer/toastReducer";
import {
  addModal,
  ModalPropsMap,
  ModalType,
  removeModal,
} from "@/redux/reducer/modalReducer";
import { modalManager } from "@/app/lib/modalManager";
import Toast from "../popup/toast";
import WriteModal from "../popup/writeModal";
import { AnimatePresence } from "framer-motion";

let globalToast:
  | ((isWarning: boolean, msg: string, time: number) => void)
  | null = null;
export const showGlobalToast = (
  isWarning: boolean,
  msg: string,
  time: number
) => {
  if (globalToast) {
    globalToast(isWarning, msg, time);
  } else {
    console.warn("UIProvider 아직 초기화 안됨");
  }
};

type PopupContextType = {
  openToast: (isWarning: boolean, msg: string, time: number) => void;
  openModal: <T extends ModalType>(
    type: T,
    props: ModalPropsMap[T]
  ) => Promise<number | string | null>;
};

const PopupContext = createContext<PopupContextType | undefined>(undefined);

const MODAL_MAP = {
  CONFIRM: (props, onClose) => (
    <AlertModal
      msg={props.msg}
      btnMsg={props.btnMsg}
      title={props.title}
      onClose={onClose}
    />
  ),
  WRITE: (props, onClose) => <WriteModal {...props} onClose={onClose} />,
} satisfies {
  [K in ModalType]: (
    props: ModalPropsMap[K],
    onClose: (result: number | string | null) => void
  ) => ReactNode;
};

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();

  const openToast = useCallback(
    (isWarning: boolean, msg: string, time: number) => {
      dispatch(addToast({ isWarning, msg, time }));
    },
    [dispatch]
  );

  globalToast = openToast;

  function openModal<T extends ModalType>(
    type: T,
    props: ModalPropsMap[T]
  ): Promise<number | string | null> {
    const id = uuidv4();
    dispatch(addModal({ type, id, props }));
    return modalManager.openModal(id);
  }

  const value = { openToast, openModal };

  return (
    <PopupContext.Provider value={value}>{children}</PopupContext.Provider>
  );
};

export const PopupContainer = () => {
  const dispatch = useAppDispatch();
  const toastItems = useAppSelector((state) => state.toastReducer.toastItem);
  const modalItems = useAppSelector((state) => state.modalReducer.modalItem);

  const handleClose = (id: string) => (result: number | string | null) => {
    dispatch(removeModal(id));
    modalManager.closeModal(id, result);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {modalItems.map((v) => {
          const onClose = handleClose(v.id);
          let content = null;
          switch (v.type) {
            case "CONFIRM":
              content = MODAL_MAP.CONFIRM(
                v.props as { msg: string; btnMsg: string[] },
                onClose
              );
              break;
            case "WRITE":
              content = MODAL_MAP.WRITE(
                v.props as ModalPropsMap["WRITE"],
                onClose
              );
              break;
          }
          return <div key={v.id}>{content}</div>;
        })}
      </AnimatePresence>
      <AnimatePresence>
        {toastItems.length > 0 && (
          <div
            id="popup-wrapper"
            className="pointer-events-none flex-wrap justify-start gap-2
          fixed w-full h-full flex flex-col px-4 pt-4 top-0 items-end max-sm:items-center z-99"
          >
            {toastItems.map((v) => (
              <Toast
                key={v.id}
                time={v.time}
                isWarning={v.isWarning}
                msg={v.msg}
                id={v.id}
                toastArrHandler={() => {
                  dispatch(removeToast(v.id));
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export const useUI = () => {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};
