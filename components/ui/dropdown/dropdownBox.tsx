"use client";
import { Dropdown, DropdownItem } from "flowbite-react";
import { DropdownType } from "./dropdownType";
import { useState } from "react";

interface BoxProps extends DropdownType {
  defaultBoxIndex: number;
  boxSize?: string;
}
export function DropdownBox({ items, clickEvt, defaultBoxIndex }: BoxProps) {
  const [boxIndex, setBoxIndex] = useState<number>(defaultBoxIndex);
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
        inlineWrapper: "w-full",
        floating: {
          style: {
            auto: "bg-background1 dark:bg-background1",
          },
          item: {
            base: "flex w-full cursor-pointer items-center justify-start px-4 py-2 text-sm hover:bg-bg-page1",
          },
        },
      }}
      label={items[boxIndex].content}
      inline
    >
      {items.map(({ content, icon }, i) => (
        <DropdownItem
          icon={icon}
          key={i}
          onClick={() => {
            setBoxIndex(i);
            if (clickEvt) clickEvt(content);
          }}
        >
          {content}
        </DropdownItem>
      ))}
    </Dropdown>
  );
}
