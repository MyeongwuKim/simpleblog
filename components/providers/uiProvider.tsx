// components/providers/UIProvider.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { v4 as uuidv4 } from "uuid";
import AlertModal from "../popup/alertModal";
import { addToast, removeToast } from "@/redux/reducer/toastReducer";
import {
  addModal,
  clearModals,
  ModalPropsMap,
  ModalType,
  removeModal,
} from "@/redux/reducer/modalReducer";
import { modalManager } from "@/app/lib/modalManager";
import Toast from "../popup/toast";
import WriteModal from "../popup/writeModal";
import { AnimatePresence } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";

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
  ) => Promise<unknown>;
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
    onClose: (value: unknown) => void
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
  ): Promise<unknown> {
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevRouteRef = useRef<string>("");
  const dispatch = useAppDispatch();
  //useAppSelector를 통한 리렌더링(모달,토스트 아이템이 push될때 리렌더링함)
  const toastItems = useAppSelector((state) => state.toastReducer.toastItem);
  const modalItems = useAppSelector((state) => state.modalReducer.modalItem);

  const handleClose = (id: string) => (result: unknown) => {
    dispatch(removeModal(id));
    modalManager.closeModal(id, result);
  };

  useEffect(() => {
    const currentRoute = `${pathname}?${searchParams.toString()}`;
    // 첫 렌더는 스킵하고 싶으면 이렇게
    if (prevRouteRef.current && prevRouteRef.current !== currentRoute) {
      // 모달 Promise 정리도 필요하면 close 처리까지 같이
      modalItems.forEach((m) => {
        modalManager.closeModal(m.id, 0); // 취소값/닫힘값 정책에 맞게
      });

      dispatch(clearModals());
    }

    prevRouteRef.current = currentRoute;
  }, [pathname, searchParams, dispatch]); // modalItems 넣으면 effect 재실행 많아질 수 있음

  return (
    <>
      <AnimatePresence>
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
