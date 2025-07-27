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

interface ToastProps {
  msg: string;
  isWarning: boolean | null;
  index: number;
  time?: number;
}

const ToastPotal = () => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [toastArr, setToastArr] = useState<ToastProps[]>([]);

  //registToastsState(setToastArr);

  useEffect(() => {
    setElement(document.getElementById("toast"));
  }, []);

  if (!element) {
    return <></>;
  }
  return (
    <div>
      {createPortal(
        toastArr.length <= 0 ? (
          <></>
        ) : (
          <div
            id="toastWrapper"
            className="pointer-events-none flex-wrap justify-start gap-2
        fixed w-full h-full flex flex-col"
          >
            {toastArr.map((v, i) => (
              <Toast
                key={v.index}
                isWarning={v.isWarning}
                msg={v.msg}
                index={v.index}
                toastArrHandler={setToastArr}
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
