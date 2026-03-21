"use client";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import CustomTabs from "../ui/buttons/TabButtons";
import { TfiWrite } from "react-icons/tfi";
import ToggleButton from "../ui/buttons/toggleButton";
import { IoSunny, IoMoon } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";
import { HiCog, HiLogout } from "react-icons/hi";
import DropdownProfile from "../ui/dropdown/dropdownProfile";
import { FaBookBookmark } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
import { useProfileQuery } from "../ui/profile/query";
import { signIn, signOut } from "next-auth/react";
import DefButton from "../ui/buttons/defButton";
import { Skeleton } from "../ui/skeleton";

const showList = ["/", "/profile", "/comments", "/collections"];

export default function Head() {
  const { setTheme, theme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [myTheme, setMyTheme] = useState<string | undefined>(theme);
  const route = useRouter();
  const pathname = usePathname();

  const { data, isLoading: isProfileLoading } = useProfileQuery({
    enabled: isLoggedIn,
  });

  useEffect(() => {
    setTheme(myTheme!);
  }, [myTheme, setTheme]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await fetch("/api/auth/session");
        const result = await response.json();
        if (mounted) {
          setIsLoggedIn(!!result?.user);
          setIsAuthChecking(false);
        }
      } catch {
        if (mounted) {
          setIsLoggedIn(false);
          setIsAuthChecking(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const loginBtnClick = useCallback(() => {
    signIn();
  }, []);

  return (
    <div
      id="HeadView"
      className="w-full h-full flex items-center py-2 gap-2 flex-col justify-center"
    >
      <div className="flex justify-between w-full">
        <div
          onClick={() => route.push("/")}
          className="flex items-center gap-2 text-text1 cursor-pointer"
        >
          <FaBookBookmark className="w-6 h-6" />
          <span className="sm:text-xl font-semibold">북마크블로그</span>
        </div>

        <div className="w-auto flex items-center gap-3">
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
          {isAuthChecking ? (
            <Skeleton className="h-[35px] w-[90px]" rounded="rounded-md" />
          ) : !isLoggedIn ? (
            <DefButton
              className="h-[35px] w-[90px] text-base"
              btnColor={"gray"}
              outline={true}
              innerItem={"로그인"}
              onClickEvt={loginBtnClick}
            />
          ) : isProfileLoading ? (
            <Skeleton className="h-[35px] w-[35px]" rounded="rounded-full" />
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

      {showList.includes(pathname) && <CustomTabs />}
    </div>
  );
}
