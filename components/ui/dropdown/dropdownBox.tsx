"use client";
import { Dropdown, DropdownItem } from "flowbite-react";
import { DropdownType } from "./dropdownType";
import { useState } from "react";

interface BoxProps extends DropdownType {
  boxSize?: string;
  value: any;
}
export function DropdownBox({ items, clickEvt, value }: BoxProps) {
  const selected = items.find((item) => item.value === value) ?? items[0];

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
            auto: "bg-background1 dark:bg-background1 border-0",
          },
          item: {
            base: "flex w-full  cursor-pointer items-center justify-start px-4 py-2 text-sm hover:bg-bg-page1",
          },
        },
      }}
      label={selected.content}
      inline
    >
      {items.map(({ content, icon, value }, i) => (
        <DropdownItem
          icon={icon}
          key={i}
          onClick={() => {
            if (clickEvt) clickEvt(value);
          }}
        >
          {content}
        </DropdownItem>
      ))}
    </Dropdown>
  );
}
