"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import TabButtons from "../ui/buttons/TabButtons";
import { TfiWrite } from "react-icons/tfi";
import ToggleButton from "../ui/buttons/toggleButton";
import { IoSunny, IoMoon } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";
import { HiCog, HiLogout } from "react-icons/hi";
import { DropdownProfile } from "../ui/dropdown/dropdownProfile";
import { FaBookBookmark } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";

const showList = ["/", "/profile", "/comments"];

export default function Head() {
  const { setTheme, theme } = useTheme();
  const [myTheme, setMyTheme] = useState<string | undefined>(theme);
  const route = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setTheme(myTheme!);
  }, [myTheme]);

  return (
    <div
      id="HeadView"
      className="w-full h-full flex items-center flex-col justify-center"
    >
      <div
        className={`w-auto h-full relative ${
          showList.includes(pathname) ? "visible" : "hidden"
        }`}
      >
        <TabButtons />
      </div>
      <div className="absolute left-[32px] ">
        <button
          onClick={() => route.push("/")}
          className="text-text1 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FaBookBookmark className="w-6 h-6" />
            <span className="text-xl font-semibold">북마크블로그</span>
          </div>
        </button>
      </div>
      <div className="w-auto  flex items-center gap-3  absolute right-[32px]">
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

        <div className="w-auto h-[45px]">
          <DropdownProfile
            clickEvt={async (content: string) => {
              switch (content) {
                case "설정":
                  route.push("/setting");
                  break;
                case "임시글":
                  route.push("/temp");
                  break;
                case "글쓰기":
                  route.push("/write");
                  break;
              }
            }}
            items={[
              { content: "글쓰기", icon: TfiWrite },
              { content: "설정", icon: HiCog },
              { content: "임시글", icon: FaSave },
              { content: "로그아웃", icon: HiLogout },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
