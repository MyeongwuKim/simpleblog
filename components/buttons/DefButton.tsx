
import { Button } from "flowbite-react";
import React, {JSX} from "react";



interface DefBtnType {
  content?: string;
  iconEle?: React.ReactNode;
  onClickEvt: () => void;
  outline: boolean;
  color: string;
}

export function DefButton({ content, iconEle, outline, color, onClickEvt }: DefBtnType) {
  return (
    <Button onClick={onClickEvt} className="w-full h-full cursor-pointer" color={color} outline={outline}>
      <div className="flex gap-2 items-center">
        {content ? <span className="font-semibold">{content}</span> : ""}
        {iconEle ? iconEle : ""}
      </div>
    </Button>
  );
}

