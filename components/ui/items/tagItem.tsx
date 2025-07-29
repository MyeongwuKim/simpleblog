"use client";
import { Badge } from "flowbite-react";

interface TagItemProps {
  text: string;
  clickEvt?: () => void;
  style?: {
    normal: string;
    disabled: string;
  };
  disabled?: boolean;
}

const TagItem = ({ text, clickEvt, style, disabled }: TagItemProps) => {
  return (
    <>
      <Badge size="md" color={style?.normal ? "cyan" : style?.normal}>
        <button className="cursor-pointer" onClick={clickEvt}>
          {text}
        </button>
      </Badge>
    </>
  );
};

export default TagItem;
