"use client";

import { AnimatePresence } from "framer-motion";
import Toast from "./toast";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { removeToast } from "@/redux/reducer/toastReducer";

export default function ToastHost() {
  const dispatch = useAppDispatch();
  const toastItems = useAppSelector((state) => state.toastReducer.toastItem);

  return (
    <AnimatePresence>
      {toastItems.length > 0 && (
        <div
          id="popup-wrapper"
          className="pointer-events-none fixed top-0 z-99 flex h-full w-full flex-col flex-wrap items-end justify-start gap-2 px-4 pt-4 max-sm:items-center"
        >
          {toastItems.map((toast) => (
            <Toast
              key={toast.id}
              time={toast.time}
              isWarning={toast.isWarning}
              msg={toast.msg}
              id={toast.id}
              toastArrHandler={() => {
                dispatch(removeToast(toast.id));
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
