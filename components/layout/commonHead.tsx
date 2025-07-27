"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import TabButtons from "../ui/buttons/TabButtons";
import { TfiWrite } from "react-icons/tfi";

import ToggleButton from "../ui/buttons/toggleButton";
import { IoSunny, IoMoon } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";
import { DropdownProfile } from "../ui/dropdown/dropdownBox";
import { HiCog, HiLogout } from "react-icons/hi";
import DefButton from "../ui/buttons/defButton";

const showList = ["/", "/profile", "/comments"];

export default function Head() {
  const { setTheme, theme } = useTheme();
  const [myTheme, setMyTheme] = useState<string | undefined>(theme);
  const route = useRouter();
  const pathname = usePathname(); // 현재 경로명 (예: /blog/post-1)

  useEffect(() => {
    setTheme(myTheme!);
  }, [myTheme]);

  return (
    <div id="HeadView" className="w-full h-full flex flex-col items-center">
      <div
        className={`w-auto h-full relative ${
          showList.includes(pathname) ? "visible" : "hidden"
        }`}
      >
        <TabButtons />
      </div>

      <div className="h-full flex items-center gap-3 absolute right-16">
        <div className="relative w-[35px] h-[35px]">
          <ToggleButton
            clickCallback={(isChecked) => {
              if (isChecked) setMyTheme("light");
              else setMyTheme("dark");
            }}
            isCheck={myTheme == "light"}
            checkIcon={<IoSunny className="w-[2rem] h-[2rem] relative" />}
            unCheckIcon={<IoMoon className="w-[2rem] h-[2rem] relative" />}
          />
        </div>
        <div className="relative w-auto h-[45px] text-text4">
          <DefButton
            onClickEvt={() => {
              route.push("/write");
            }}
            style={{ outline: true, color: "dark" }}
            content="글쓰기"
            iconEle={<TfiWrite className="w-6 h-6" />}
          />
        </div>
        <div className="w-auto h-[45px]">
          <DropdownProfile
            clickEvt={(content: string) => {
              if (content == "설정") route.push("/setting");
            }}
            items={[
              { content: "설정", icon: HiCog },
              { content: "로그아웃", icon: HiLogout },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
