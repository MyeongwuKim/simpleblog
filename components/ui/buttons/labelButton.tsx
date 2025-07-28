import { BtnType } from "./buttonType";

interface LblBtnProps extends BtnType {
  style: {
    color?: string;
    textSize: string;
  };
}

const getTextColor = (color: string) => {
  let str = "";
  switch (color) {
    case "cyan":
      str = ` text-cyan-600  hover:text-cyan-400 
     dark:text-cyan-400 dark:hover:text-cyan-200`;
      break;
    default:
      str = `text-text3 hover:text-text2`;
  }
  return str;
};

export default function LabelButton({ content, onClickEvt, style }: LblBtnProps) {
  return (
    <button
      onClick={onClickEvt}
      className={`${style?.textSize} cursor-pointer underline ${getTextColor(style?.color!)}`}
    >
      {content}
    </button>
  );
}
