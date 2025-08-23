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
  const activeIndex = tabList.findIndex((t) => t.pathname === pathname);

  // underline 위치/폭
  const [underline, setUnderline] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (activeIndex !== -1 && tabRefs.current[activeIndex]) {
      const el = tabRefs.current[activeIndex]!;
      setUnderline({
        left: el.offsetLeft,
        width: el.offsetWidth,
      });
    }
  }, [activeIndex, pathname]);

  return (
    <div className="flex flex-col gap-2 relative">
      {/* Tab List */}
      <div className="flex text-center relative">
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
              className={`flex items-center justify-center rounded-t-lg p-4 text-sm font-medium focus:outline-none
                ${
                  isActive
                    ? "text-text1 font-bold"
                    : "text-text3 hover:text-text2"
                }`}
            >
              <Icon className="mr-2 h-5 w-5" />
              {tab.title}
            </button>
          );
        })}
      </div>

      {/* Underline */}
      <div
        className="ease-in-out duration-200 absolute border-b-2 border-text1"
        style={{
          bottom: 0, // 버튼 바로 아래
          left: underline.left,
          width: underline.width,
        }}
      />
    </div>
  );
}
