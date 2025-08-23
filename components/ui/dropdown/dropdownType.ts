import { ComponentProps, FC } from "react";

export type DropdownType = {
  items: {
    content: string;
    value: any;
    icon?: FC<ComponentProps<"svg">>;
  }[];
  clickEvt?: (value: any) => void;
};
