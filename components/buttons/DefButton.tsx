
import { Button } from "flowbite-react";
import React, {JSX} from "react";



interface DefBtnType {
    content?:string;
    iconEle?: React.ReactNode;
    className?:string;
    outline:boolean;
    color:string;
}

export function DefButton({content,iconEle,className,outline,color}:DefBtnType) {
  return (
      <Button className="w-full h-full cursor-pointer text-text1" color={color} outline = {outline}>
        <div className="flex gap-2 items-center">
         {content ? <span className={className}>{content}</span> : ""}
        {iconEle ? iconEle : ""}
        </div>
      </Button>
  );
}

