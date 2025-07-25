"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import TabButtons from "./TabButtons";
import { TfiWrite } from "react-icons/tfi";
import { DefButton } from "../buttons/DefButton";
import ToggleButton from "../buttons/toggleButton";
import { CiSun } from "react-icons/ci";
import { IoMoonOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function Head() {
  const { setTheme, theme } = useTheme();
  const [myTheme, setMyTheme] = useState<string>();
  const route = useRouter();
  useEffect(() => {
    setTheme(myTheme!);
  }, [myTheme]);
  return (
    <div id="HeadView" className="w-full h-full flex flex-col items-center">
      <TabButtons />
      <div className="h-full flex items-center gap-2 absolute right-16">
        <div className="relative w-[35px] h-[35px]">
          <ToggleButton
            clickCallback={(isChecked) => {
              if (isChecked) setMyTheme("light");
              else setMyTheme("dark");
            }}
            isCheck={theme == "light"}
            checkIcon={<CiSun className="w-[2rem] h-[2rem] relative" />}
            unCheckIcon={
              <IoMoonOutline className="w-[2rem] h-[2rem] relative" />
            }
          />
        </div>
        <div className="relative w-auto h-[45px] text-text4">
          <DefButton
            onClickEvt={() => {
              route.push("write");
            }}
            style={{ outline: true, color: "dark" }}
            outline={true}
            content="글쓰기"
            iconEle={<TfiWrite className="w-6 h-6" />}
          />
        </div>
      </div>
    </div>
  );
}
