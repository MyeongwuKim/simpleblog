"use client";
import { Badge } from "flowbite-react";
import { useEffect } from "react";

// 'normal' 모드일 때 추가될 속성이 없으므로, 기본 속성 인터페이스를 정의합니다.
interface BaseTagItemProps {
  text: string;
  clickEvt?: () => void;
}

// 'check' 모드일 때 추가될 속성 인터페이스를 정의합니다.
interface TagItemCheckModeAdditions {
  isChecked: boolean;
}

type TagItemProps<Mode extends "normal" | "check"> = Mode extends "check"
  ? BaseTagItemProps & { mode: "check" } & TagItemCheckModeAdditions
  : BaseTagItemProps & { mode?: "normal" }; // 'normal' 모드에서는 mode 속성이 선택적일 수 있습니다.

type AnyTagItemProps = TagItemProps<"normal"> | TagItemProps<"check">;

const TagItem = (props: AnyTagItemProps) => {
  return (
    <>
      <Badge
        theme={{
          root: {
            color: {
              gray: "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
              cyan: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200 dark:bg-cyan-200 dark:text-cyan-900 dark:hover:bg-cyan-300",
            },
          },
        }}
        color={
          props.mode == "check" ? (props.isChecked ? "cyan" : "gray") : "cyan"
        }
        size="md"
      >
        <button className="cursor-pointer" onClick={props.clickEvt}>
          {props.text}
        </button>
      </Badge>
    </>
  );
};

export default TagItem;
