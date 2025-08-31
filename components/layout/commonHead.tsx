"use client";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import TabButtons from "../ui/buttons/TabButtons";
import { TfiWrite } from "react-icons/tfi";
import ToggleButton from "../ui/buttons/toggleButton";
import { IoSunny, IoMoon } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";
import { HiCog, HiLogout } from "react-icons/hi";
import { DropdownProfile } from "../ui/dropdown/dropdownProfile";
import { FaBookBookmark } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
import { useProfileQuery } from "../ui/profile/query";
import { signIn, signOut, useSession } from "next-auth/react";
import DefButton from "../ui/buttons/defButton";

const showList = ["/", "/profile", "/comments"];

export default function Head() {
  const { setTheme, theme } = useTheme();
  const { data: session } = useSession();
  const [myTheme, setMyTheme] = useState<string | undefined>(theme);
  const route = useRouter();
  const pathname = usePathname();

  const { data } = useProfileQuery();

  useEffect(() => {
    setTheme(myTheme!);
  }, [myTheme]);
  const loginBtnClick = useCallback(() => {
    signIn();
  }, []);
  return (
    <div
      id="HeadView"
      className="w-full h-full flex items-center py-2 gap-2 flex-col justify-center"
    >
      <div className="flex justify-between w-full">
        <button
          onClick={() => route.push("/")}
          className="text-text1 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FaBookBookmark className="w-6 h-6" />
            <span className="sm:text-xl  font-semibold">북마크블로그</span>
          </div>
        </button>
        <div className="w-auto  flex items-center gap-3">
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
          {!session ? (
            <DefButton
              className="h-[45px] w-[90px] "
              btnColor={"gray"}
              outline={true}
              innerItem={"로그인"}
              onClickEvt={loginBtnClick}
            />
          ) : (
            <div className="w-auto h-[45px]">
              <DropdownProfile
                profileImg={data?.data && data?.data.profileImg}
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
                    case "로그아웃":
                      signOut();
                      break;
                  }
                }}
                items={[
                  { content: "글쓰기", icon: TfiWrite, value: "글쓰기" },
                  { content: "설정", icon: HiCog, value: "설정" },
                  { content: "임시글", icon: FaSave, value: "임시글" },
                  { content: "로그아웃", icon: HiLogout, value: "로그아웃" },
                ]}
              />
            </div>
          )}
        </div>
      </div>
      <div
        className={`w-full h-full relative ${
          showList.includes(pathname) ? "visible" : "hidden"
        }`}
      >
        <TabButtons />
      </div>
    </div>
  );
}
