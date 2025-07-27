"use client";

import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import Image from "next/image";
import { ComponentProps, FC } from "react";
import { IoIosArrowDown } from "react-icons/io";

type DropdownType = {
  items: {
    content: string;
    icon?: FC<ComponentProps<"svg">>;
  }[];
  clickEvt?: (content: string) => void;
};

interface Profile extends DropdownType {
  profileImg?: string;
}
export function DropdownProfile({ items, clickEvt, profileImg }: Profile) {
  return (
    <Dropdown
      applyTheme={{
        floating: {
          item: {
            base: "replace",
          },
        },
      }}
      theme={{
        floating: {
          style: {
            auto: "bg-background1 dark:bg-background1",
          },
          item: {
            base: "flex w-full cursor-pointer items-center justify-start px-4 py-2 text-sm hover:bg-bg-page1",
          },
        },
      }}
      dismissOnClick={true}
      renderTrigger={() => (
        <div className="h-full flex relative items-center gap-2">
          <div className="w-[45px] h-[45px]  rounded-full bg-background3 relative">
            {profileImg ? (
              <Image
                objectFit="cover"
                src="profileImg"
                fill
                alt="profile"
                className="w-full h-full rounded-full relative"
              />
            ) : (
              ""
            )}
          </div>
          <IoIosArrowDown className="w-4 h-4 text-text1"></IoIosArrowDown>
        </div>
      )}
    >
      {items.map(({ content, icon }, i) => (
        <DropdownItem
          icon={icon}
          key={i}
          onClick={() => {
            if (clickEvt) clickEvt(content);
          }}
        >
          {content}
        </DropdownItem>
      ))}
    </Dropdown>
  );
}
