import { Button, ButtonColors } from "flowbite-react";
import { DynamicStringEnumKeysOf } from "flowbite-react/types";
import React, { JSX } from "react";

type BtnType = {
  content?: string;
  iconEle?: React.ReactNode;
  onClickEvt: () => void;
  outline: boolean;
};

interface DefBtnProps extends BtnType {
  style?: {
    textColor?: string;
    textSize?: string;
    outline?: boolean;
    color?: DynamicStringEnumKeysOf<ButtonColors>;
  };
}

export function DefButton({
  content,
  iconEle,
  style,
  onClickEvt,
}: DefBtnProps) {
  return (
    <Button
      onClick={onClickEvt}
      className={`w-full h-full cursor-pointer text-[1.125rem] focus:ring-0
        ${style?.textColor ? style?.textColor : "text-text1"} ${
        !style?.outline ? "hover:bg-bg-page3" : ""
      }`}
      color={style?.color}
      outline={style?.outline}
    >
      <div className="flex gap-2 items-center">
        {iconEle ? iconEle : ""}
        {content ? <span className="">{content}</span> : ""}
      </div>
    </Button>
  );
}
