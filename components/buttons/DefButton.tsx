import { Button, ButtonColors } from "flowbite-react";
import { DynamicStringEnumKeysOf } from "flowbite-react/types";
import React, { JSX } from "react";
import { BtnType } from "./buttonType";

interface DefBtnProps extends BtnType {
  style?: {
    textColor?: string;
    textSize?: string;
    noBg?: boolean;
    outline?: boolean;
    color?: DynamicStringEnumKeysOf<ButtonColors>;
  };
}

export default function DefButton({
  content,
  iconEle,
  style,
  onClickEvt,
}: DefBtnProps) {
  return (
    <Button
      theme={{
        color: {
          cyan: `bg-cyan-300  hover:bg-cyan-400 
          focus:ring-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:focus:ring-cyan-700`,
        },
      }}
      onClick={onClickEvt}
      className={`w-full h-full cursor-pointer text-[1.125rem] focus:ring-0
        ${style?.textColor ? style?.textColor : "text-text1"} ${
        style?.noBg ? "hover:bg-bg-page3" : ""
      }`}
      color={style?.color}
      outline={style?.outline}
    >
      <div className="flex gap-2 items-center">
        {iconEle ? iconEle : ""}
        {content ? (
          <span className={`${style?.textSize ? style?.textSize : ""}`}>
            {content}
          </span>
        ) : (
          ""
        )}
      </div>
    </Button>
  );
}
