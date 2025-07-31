import React from "react";

export type BtnType = {
  content?: string | React.ReactNode;
  iconEle?: React.ReactNode;
  onClickEvt?: () => void;
  type?: "submit" | "reset" | "button";
};
