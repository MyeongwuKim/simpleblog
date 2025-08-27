"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HiUserCircle } from "react-icons/hi";
import { MdDashboard, MdInsertComment } from "react-icons/md";

type TabItemType = {
  title: string;
  icon: React.ComponentType<any>;
  pathname: string;
};

const tabList: TabItemType[] = [
  { title: "게시글", icon: MdDashboard, pathname: "/" },
  { title: "프로필", icon: HiUserCircle, pathname: "/profile" },
  { title: "방명록", icon: MdInsertComment, pathname: "/comments" },
];

export default function CustomTabs() {
  const router = useRouter();
  const pathname = usePathname();

  // 태그 페이지(`/react`, `/nextjs`)도 게시글 탭으로 인식
  const isPostPage =
    pathname === "/" ||
    (!pathname.startsWith("/profile") &&
      !pathname.startsWith("/comments") &&
      !pathname.startsWith("/post"));

  let activeIndex = tabList.findIndex((t) => t.pathname === pathname);
  if (isPostPage) {
    activeIndex = 0; // 게시글 탭 활성화
  }

  // underline 위치/폭
  const [underline, setUnderline] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    function updateUnderline() {
      if (activeIndex !== -1 && tabRefs.current[activeIndex]) {
        const el = tabRefs.current[activeIndex]!;
        setUnderline({
          left: el.offsetLeft,
          width: el.offsetWidth,
        });
      }
    }

    updateUnderline(); // 처음 실행
    window.addEventListener("resize", updateUnderline);

    return () => {
      window.removeEventListener("resize", updateUnderline);
    };
  }, [activeIndex, pathname]);

  return (
    <div className="flex flex-col gap-2 relative">
      {/* Tab List */}
      <div className="flex text-center relative sm:justify-center">
        {tabList.map((tab, i) => {
          const Icon = tab.icon;
          const isActive = i === activeIndex;

          return (
            <button
              key={tab.pathname}
              ref={(el) => {
                tabRefs.current[i] = el as HTMLButtonElement | null;
              }}
              onClick={() => router.push(tab.pathname)}
              className={`flex items-center max-sm:w-1/3 w-1/6  justify-center rounded-t-lg p-4 text-sm  focus:outline-none
                ${
                  isActive
                    ? "text-text1 font-bold "
                    : "text-text3 hover:text-text2 cursor-pointer"
                }`}
            >
              <Icon className="mr-2 h-5 w-5" />
              <span className="max-xs:hidden"> {tab.title}</span>
            </button>
          );
        })}
      </div>

      {/* Underline */}
      <div
        className="ease-in-out duration-200 absolute border-b-2 "
        style={{
          bottom: 0,
          left: underline.left,
          width: underline.width,
        }}
      />
    </div>
  );
}
