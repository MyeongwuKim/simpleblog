"use client";
import { Button, ButtonColors } from "flowbite-react";
import { DynamicStringEnumKeysOf } from "flowbite-react/types";
import React, { memo } from "react";
import { CommonBtnProps } from "./buttonType";

interface DefBtnProps extends CommonBtnProps {
  outline?: boolean;
  btnColor?: DynamicStringEnumKeysOf<ButtonColors>;
  className?: string;
}

function DefButton({
  innerItem,
  iconEle,
  outline,
  onClickEvt,
  className = "",
  btnColor,
  ...rest
}: DefBtnProps) {
  return (
    <Button
      {...rest}
      theme={{
        color: {
          cyan: `bg-cyan-300  hover:bg-cyan-400 
          focus:ring-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:focus:ring-cyan-700`,
        },
      }}
      onClick={onClickEvt}
      className={`w-full h-full cursor-pointer text-[1.125rem] focus:ring-0 font-semibold ${className}`}
      color={btnColor}
      outline={outline}
    >
      <div className="flex gap-2 items-center">
        {iconEle && iconEle}
        {innerItem && <span>{innerItem}</span>}
      </div>
    </Button>
  );
}

export default memo(DefButton);
