"use client";
import { NextPage } from "next";
import { Dispatch, useEffect, SetStateAction, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi2";

interface ToastProps {
  msg: string;
  isWarning: boolean | null;
  toastArrHandler: any;
  index: number;
}

type stoargeType = { [index: number]: NodeJS.Timeout };
let timerStorage: stoargeType = {};

const Toast: NextPage<ToastProps> = ({
  msg,
  isWarning,
  toastArrHandler,
  index,
}) => {
  const [fixedTime, setFixedTime] = useState<number>(3);

  useEffect(() => {
    timeoutLogic();
  }, []);

  const timeoutLogic = () => {
    const fixedWidth = document.getElementById(`_toastView${index}`)
      ?.clientWidth!;

    let timeBar = document.getElementById(`_toastTime${index}`)!;
    timeBar.style.width = fixedWidth.toString();
    +"px";
    let rate = Number((fixedWidth / fixedTime).toFixed(2));
    let currentTime = fixedTime;
    let _timer = setInterval(() => {
      if (currentTime <= 0) {
        clearInterval(timerStorage[index]);
        delete timerStorage[index];
        toastArrHandler((prev: any[]) => {
          let newPrev = [...prev];
          newPrev.splice(0, 1);
          return newPrev;
        });
      }
      currentTime -= 0.1;
      timeBar.style.width =
        (rate * Number(currentTime.toFixed(2))).toString() + "px";
    }, 100);

    timerStorage[index] = _timer;
  };

  return (
    <div
      id={`_toastContainer${index}`}
      className="w-full  md:w-[400px] sm:w-[300px] ti:w-[260px]  min-h-[46px] h-auto "
    >
      <div
        id={`_toastView${index}`}
        onClick={() => {
          //document.getElementById("cautionWindow").remove();
        }}
        className={`relative left-2 top-2 flex flex-col items-center
        ${
          isWarning == null
            ? ""
            : isWarning
            ? "text-red-800  bg-red-50 dark:bg-gray-800 dark:text-red-400"
            : "text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400"
        }
       z-[99] w-full h-full  rounded-lg shadow-xl`}
      >
        <div
          id={`_toastTime${index}`}
          className={`w-full absolute left-0 transition-all h-2 ${
            isWarning == null ? "" : isWarning ? "bg-red-400" : "bg-green-400"
          } rounded-t-lg`}
        />
        <div className="flex items-center w-full p-4 gap-2 mt-2">
          <HiOutlineExclamationCircle className="w-6 h-6 m-auto" />
          <div className="font-semibold md:text-lg ti:text-sm sm:text-base break-words w-full h-auto">
            {msg}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
