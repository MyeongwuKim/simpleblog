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
import { addConfirm, removeConfirm } from "@/redux/reducer/confirmReducer";
import { modalManager } from "@/app/lib/modalManager";
import Toast from "../popup/toast";

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
  openConfirm: (props: {
    msg: string;
    btnMsg: string[];
    title?: string;
  }) => Promise<number>;
};

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const toastItems = useAppSelector((state) => state.toastReducer.toastItem);
  const modalItems = useAppSelector(
    (state) => state.confirmReducer.confirmItem
  );
  const dispatch = useAppDispatch();

  const openToast = useCallback(
    (isWarning: boolean, msg: string, time: number) => {
      dispatch(addToast({ isWarning, msg, time }));
    },
    [dispatch]
  );

  globalToast = openToast;

  const openConfirm = async (props: {
    msg: string;
    btnMsg: string[];
    title?: string;
  }): Promise<number> => {
    const id = uuidv4();
    dispatch(addConfirm({ id, props }));
    const result = await modalManager.openModal(id);
    return result;
  };

  const handleClose = (id: string) => (result?: number) => {
    dispatch(removeConfirm(id));
    modalManager.closeModal(id, result);
  };

  const value = { openToast, openConfirm };

  return (
    <PopupContext.Provider value={value}>
      {children}

      {/* 모달 렌더링 */}
      {modalItems.map((v) => {
        const onClose = handleClose(v.id);

        return (
          <div key={v.id}>
            <AlertModal {...v.props} onClose={onClose} />
          </div>
        );
      })}

      {/* toast 렌더링 */}
      {toastItems.length > 0 && (
        <div
          id="toastWrapper"
          className="pointer-events-none flex-wrap justify-start gap-2
          fixed w-full h-full flex flex-col right-8 top-0 items-end z-99"
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
    </PopupContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};
