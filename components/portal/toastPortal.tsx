"use client";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Toast from "../modal/toast";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { add, remove } from "@/redux/reducer/toastReducer";

const ToastPotal = () => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const toastItems = useAppSelector((state) => state.toastReducer.toastItem);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setElement(document.getElementById("toast"));
  }, []);

  if (!element) {
    return <></>;
  }
  return (
    <div>
      {createPortal(
        toastItems.length <= 0 ? (
          <></>
        ) : (
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
                  dispatch(remove(v.id));
                }}
              />
            ))}
          </div>
        ),
        element
      )}
    </div>
  );
};

export default ToastPotal;
