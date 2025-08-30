"use client";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi2";

interface ToastProps {
  msg: string;
  isWarning: boolean | null;
  toastArrHandler: () => void;
  time: number;
  id: string;
}

type stoargeType = { [id: string]: NodeJS.Timeout };
const timerStorage: stoargeType = {};

const Toast: NextPage<ToastProps> = ({
  msg,
  isWarning,
  toastArrHandler,
  id,
  time,
}) => {
  const [fixedTime] = useState<number>(time);

  useEffect(() => {
    timeoutLogic();
  }, []);

  const timeoutLogic = () => {
    const toastEl = document.getElementById(`_toastView${id}`);
    const timeBarEl = document.getElementById(`_toastTime${id}`);

    if (!toastEl || !timeBarEl) return; // ✅ 안전하게 null 체크

    const fixedWidth = toastEl.clientWidth;
    const timeBar = timeBarEl as HTMLElement;
    timeBar.style.width = fixedWidth + "px";

    const rate = Number((fixedWidth / fixedTime).toFixed(2));
    let currentTime = fixedTime;

    const _timer = setInterval(() => {
      if (currentTime <= 0) {
        clearInterval(timerStorage[id]);
        delete timerStorage[id];
        toastArrHandler();
      } else {
        currentTime -= 0.1;
        timeBar.style.width =
          (rate * Number(currentTime.toFixed(2))).toString() + "px";
      }
    }, 100);

    timerStorage[id] = _timer;
  };
  return (
    <div
      id={`_toastContainer${id}`}
      className="w-full  md:w-[400px] sm:w-[300px] ti:w-[260px]  min-h-[46px] h-auto "
    >
      <div
        id={`_toastView${id}`}
        onClick={() => {
          //document.getElementById("cautionWindow").remove();
        }}
        className={`relative left-2 top-2 flex flex-col items-center
        ${
          isWarning == null
            ? ""
            : isWarning
            ? "text-red-700  bg-background1 dark:text-red-400"
            : "text-green-700 bg-background1 dark:text-green-400"
        }
       z-[99] w-full h-full  rounded-lg shadow-xl`}
      >
        <div
          id={`_toastTime${id}`}
          className={`w-full absolute left-0 transition-all h-2 ${
            isWarning == null ? "" : isWarning ? "bg-red-400" : "bg-green-400"
          } rounded-t-lg`}
        />
        <div className="flex items-center w-full p-4 gap-2 mt-2">
          <HiOutlineExclamationCircle className="w-8 h-8 m-auto" />
          <div className="font-semibold md:text-lg ti:text-sm sm:text-base break-words w-full h-auto">
            {msg}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
