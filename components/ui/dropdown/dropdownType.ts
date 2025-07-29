import { ComponentProps, FC } from "react";

export type DropdownType = {
  items: {
    content: string;
    icon?: FC<ComponentProps<"svg">>;
  }[];
  clickEvt?: (content: string) => void;
};
