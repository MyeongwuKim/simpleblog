import { memo } from "react";
import { CommonBtnProps } from "./buttonType";

type colorType = "gray" | "cyan";
interface LblBtnProps extends CommonBtnProps {
  color?: colorType;
  className?: string;
}

const getTextColor = (color: colorType) => {
  let str = "";
  switch (color) {
    case "cyan":
      str = ` text-cyan-600  hover:text-cyan-400 
     dark:text-cyan-400 dark:hover:text-cyan-200`;
      break;
    default:
      str = `text-text3 hover:text-text1 `;
  }
  return str;
};

function LabelButton({
  onClickEvt,
  color,
  innerItem,
  className = "",
}: LblBtnProps) {
  return (
    <button
      onClick={onClickEvt}
      className={`${className} w-full h-full text-left cursor-pointer ${getTextColor(
        color!
      )}`}
    >
      {innerItem}
    </button>
  );
}

export default memo(LabelButton);
