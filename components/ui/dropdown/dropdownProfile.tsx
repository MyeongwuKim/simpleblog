"use client";

import { Dropdown, DropdownItem } from "flowbite-react";
import Image from "next/image";
import { IoIosArrowDown } from "react-icons/io";
import { DropdownType } from "./dropdownType";
import { getDeliveryDomain } from "@/app/hooks/useUtil";

interface ProfileProps extends DropdownType {
  profileImg?: string | null;
}
export function DropdownProfile({ items, clickEvt, profileImg }: ProfileProps) {
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
            auto: "bg-background1 dark:bg-background1 border-none",
          },
          item: {
            base: "flex w-full cursor-pointer focus:outline-none items-center justify-start px-4 py-2 text-sm hover:bg-bg-page1",
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
                src={getDeliveryDomain(profileImg, "thumbnail")}
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
