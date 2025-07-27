import { TextInputSizes } from "flowbite-react";
import { DynamicStringEnumKeysOf } from "flowbite-react/types";
import { FC, HTMLInputTypeAttribute, SVGProps } from "react";

export type InputFieldType = {
  type: HTMLInputTypeAttribute;
  size: DynamicStringEnumKeysOf<TextInputSizes>;
  icon?: FC<SVGProps<SVGSVGElement>>;
};
