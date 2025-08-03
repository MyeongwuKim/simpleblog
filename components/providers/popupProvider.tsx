"use client";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  addToast,
  removeToast,
  openReduxModal,
  closeReduxModal,
} from "@/redux/reducer/popupReducer";
import Toast from "../popup/toast";
import AlertModal from "../popup/alertModal";

type PopupContextType = {
  openToast: (isWarning: boolean, msg: string, time: number) => void;
  openModal: (
    msg: string,
    btnInfo: string[],
    title?: string
  ) => Promise<unknown>;
};

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider = ({ children }: { children: React.ReactNode }) => {
  const toastItems = useAppSelector((state) => state.popupReducer.toastItem);
  const modalObj = useAppSelector((state) => state.popupReducer.modalObj);
  const dispatch = useAppDispatch();
  const [modalState, setModalState] = useState<{
    resolve: (value: unknown) => void;
  }>();

  const openToast = useCallback(
    (isWarning: boolean, msg: string, time: number) => {
      dispatch(addToast({ isWarning, msg, time }));
    },
    [dispatch]
  );
  const openModal = useCallback(
    (msg: string, btnInfo: string[], title?: string) => {
      return new Promise<unknown>((resolve) => {
        dispatch(openReduxModal({ msg, btnInfo, title }));
        setModalState({ resolve });
      });
    },
    [dispatch]
  );
  const value = { openToast, openModal };

  return (
    <PopupContext.Provider value={value}>
      {children}
      {modalObj.isOpen && (
        <AlertModal
          msg={modalObj.msg}
          btnMsg={modalObj.btnInfo}
          title={modalObj.title}
          onClose={(result: unknown) => {
            modalState?.resolve(result);
            dispatch(closeReduxModal());
          }}
        />
      )}
      {toastItems.length > 0 && (
        <div
          id="toastWrapper"
          className="pointer-events-none flex-wrap justify-start gap-2
        fixed w-full h-full flex flex-col"
        >
          {toastItems.map((v, i) => (
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

// 2. useModal Hook
export const usePopup = () => {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
