import { ComponentProps, FC } from "react";

export type DropdownType<T = string> = {
  items: {
    content: string;
    value: T;
    icon?: FC<ComponentProps<"svg">>;
  }[];
  clickEvt?: (value: T) => void;
};
