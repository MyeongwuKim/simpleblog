"use client";
import { Dropdown, DropdownItem } from "flowbite-react";
import { DropdownType } from "./dropdownType";
import { memo } from "react";

interface BoxProps<T = string> extends DropdownType<T> {
  boxSize?: string;
  value: T;
}

const DropdownBox = ({ items, clickEvt, value }: BoxProps) => {
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
            base: "flex w-full cursor-pointer items-center justify-start px-4 py-2 text-sm hover:bg-bg-page1",
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
};

// 이름 표시 (Profiler/DevTools에서 보기 편하게)
DropdownBox.displayName = "DropdownBox";

// React.memo 적용
export default memo(DropdownBox, (prev, next) => {
  // value, items, clickEvt 중 하나라도 바뀌면 리렌더
  if (prev.value !== next.value) return false;
  if (prev.items !== next.items) return false;
  if (prev.clickEvt !== next.clickEvt) return false;
  if (prev.boxSize !== next.boxSize) return false;

  return true;
});
