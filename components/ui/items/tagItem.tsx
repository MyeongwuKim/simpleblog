"use client";
import { Badge } from "flowbite-react";
import { memo } from "react";

interface BaseTagItemProps {
  text: string;
  id: string;
  body?: string; // body 값도 받을 수 있게
  clickEvt?: (value: string) => void;
  clickValueType?: "id" | "body"; // ← 추가
}

interface TagItemCheckModeAdditions {
  isChecked: boolean;
}

type TagItemProps<Mode extends "normal" | "check"> = Mode extends "check"
  ? BaseTagItemProps & { mode: "check" } & TagItemCheckModeAdditions
  : BaseTagItemProps & { mode?: "normal" };

type AnyTagItemProps = TagItemProps<"normal"> | TagItemProps<"check">;

const TagItem = (props: AnyTagItemProps) => {
  const handleClick = () => {
    if (!props.clickEvt) return;

    if (props.clickValueType === "body" && props.body) {
      props.clickEvt(props.body);
    } else {
      props.clickEvt(props.id);
    }
  };

  return (
    <Badge
      theme={{
        root: {
          color: {
            gray:
              props.mode === "check" && props.isChecked
                ? "bg-gray-100 text-gray-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
            cyan:
              props.mode === "check" && props.isChecked
                ? "bg-cyan-100 text-cyan-800"
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
        className={`${
          props.mode === "check"
            ? props.isChecked
              ? "pointer-events-none"
              : "cursor-pointer"
            : "cursor-pointer"
        }`}
        onClick={handleClick}
      >
        {props.text}
      </button>
    </Badge>
  );
};

export default memo(TagItem, (prev, next) => {
  if (prev.mode !== next.mode) return false;
  if (prev.mode === "check" && next.mode === "check") {
    if (prev.isChecked !== next.isChecked) return false;
  }
  if (prev.text !== next.text) return false;
  if (prev.id !== next.id) return false;
  if (prev.body !== next.body) return false; // body 비교 추가
  if (prev.clickEvt !== next.clickEvt) return false;
  if (prev.clickValueType !== next.clickValueType) return false;
  return true;
});
