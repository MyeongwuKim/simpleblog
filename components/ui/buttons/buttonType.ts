import React, { ButtonHTMLAttributes } from "react";

export interface CommonBtnProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  innerItem?: string | React.ReactNode;
  iconEle?: React.ReactNode;
  onClickEvt?: () => void;
}
