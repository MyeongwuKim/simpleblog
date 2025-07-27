"use client";
import { TabItem, Tabs } from "flowbite-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import { HiUserCircle } from "react-icons/hi";
import { MdDashboard, MdInsertComment } from "react-icons/md";

type TabItemType = {
  title: string;
  icon: IconType;
  pathname: string;
};

const tabList: TabItemType[] = [
  { title: "포스트", icon: MdDashboard, pathname: "/" },
  { title: "뭐하는인간?", icon: HiUserCircle, pathname: "/profile" },
  { title: "방명록", icon: MdInsertComment, pathname: "/comments" },
];

export default function TabButtons() {
  const router = useRouter();
  const pathname = usePathname();
  const tabItems = useRef<{ [key: string]: number }>({});
  const [tabId, setTabId] = useState<number>(0);

  useEffect(() => {
    for (let i = 0; i < tabList.length; i++) {
      let item = tabList[i];
      tabItems.current[item.pathname] = i;
    }
    console.log(tabItems.current);
  }, []);

  useEffect(() => {
    setTabId(tabItems.current[pathname]);
  }, [pathname]);

  return (
    <div className="w-auto relative">
      <Tabs
        theme={{
          tablist: {
            base: "w-auto",
            tabitem: {
              base: "text-xl relative",
              variant: {
                pills: {
                  active: {
                    off: "text-text3 cursor-pointer hover:text-text3 dark:hover:text-text3 dark:hover:bg-transparent",
                    on: "text-text1  font-bold bg-transparent rounded-none ",
                  },
                },
              },
            },
          },
        }}
        variant="pills"
        onActiveTabChange={(tab) => {
          setTabId(tab);
          router.push(tabList[tab].pathname);
        }}
      >
        {tabList.map((v, i) => (
          <TabItem
            active={v.pathname == pathname}
            title={v.title}
            icon={v.icon}
          />
        ))}
      </Tabs>
      <div
        style={{
          left: `${tabId * 33 + 2}%`,
        }}
        id="Tab_UnderLine"
        className={`ease-in-out duration-200 absolute top-[60px] border-b-2 w-[33.3%]`}
      />
    </div>
  );
}
