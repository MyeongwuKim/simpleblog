"use client";
import { Badge } from "flowbite-react";
import { memo, useEffect } from "react";

// 'normal' 모드일 때 추가될 속성이 없으므로, 기본 속성 인터페이스를 정의합니다.
interface BaseTagItemProps {
  text: string;
  clickEvt?: (tagBody: string) => void;
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
    <Badge
      applyTheme={{
        root: {
          color: {
            cyan: "replace",
            gray: "replace",
          },
        },
      }}
      theme={{
        root: {
          color: {
            gray:
              props.mode === "check" && props.isChecked
                ? "bg-gray-100 text-gray-800" // hover 제거, 클릭 불가
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
            cyan:
              props.mode === "check" && props.isChecked
                ? "bg-cyan-100 text-cyan-800 " // hover 제거, 클릭 불가
                : "bg-cyan-100 text-cyan-800 hover:bg-cyan-200 dark:bg-cyan-200 dark:text-cyan-900 dark:hover:bg-cyan-300",
          },
        },
      }}
      color={
        props.mode === "check" ? (props.isChecked ? "cyan" : "gray") : "cyan"
      }
      size="md"
    >
      <button
        className={`
      ${
        props.mode === "check"
          ? props.isChecked
            ? "pointer-events-none"
            : " cursor-pointer"
          : " cursor-pointer"
      }
        cursor-pointer`}
        onClick={() => {
          if (props.clickEvt) props.clickEvt(props.text);
        }}
      >
        {props.text}
      </button>
    </Badge>
  );
};

//export default TagItem;
export default memo(TagItem, (prev, next) => {
  // mode가 다르면 리렌더 필요
  if (prev.mode !== next.mode) return false;

  // mode === "check"인 경우만 isChecked 비교
  if (prev.mode === "check" && next.mode === "check") {
    if (prev.isChecked !== next.isChecked) {
      return false;
    }
  }

  // 공통 props 비교
  if (prev.text !== next.text) return false;
  if (prev.clickEvt !== next.clickEvt) return false;

  return true; // 모두 같으면 리렌더 막음
});
