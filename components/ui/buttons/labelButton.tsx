import { memo } from "react";
import { CommonBtnProps } from "./buttonType";

type colorType = "gray" | "cyan" | "red";
interface LblBtnProps extends CommonBtnProps {
  color?: colorType;
  className?: string;
}

const getTextColor = (color: colorType) => {
  let str = "";
  switch (color) {
    case "red":
      str = `text-red-500
  hover:text-red-600
  dark:text-red-400
  dark:hover:text-red-300`;
      break;
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
      className={`${className} text-left cursor-pointer   transition-colors ${getTextColor(
        color!
      )}`}
    >
      {innerItem}
    </button>
  );
}

export default memo(LabelButton);
