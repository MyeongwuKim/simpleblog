export type BtnType = {
  content?: string;
  iconEle?: React.ReactNode;
  onClickEvt: () => void;
  type?: "submit" | "reset" | "button";
};
