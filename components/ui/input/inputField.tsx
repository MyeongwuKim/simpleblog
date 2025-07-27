import { Label, TextInput } from "flowbite-react";
import { TextInputSizes } from "flowbite-react";
import { DynamicStringEnumKeysOf } from "flowbite-react/types";
import { FC, HTMLInputTypeAttribute, SVGProps } from "react";
import { inputFieldType } from "./formType";

interface InputFieldProps extends inputFieldType {
  type: HTMLInputTypeAttribute;
  size: DynamicStringEnumKeysOf<TextInputSizes>;
  icon?: FC<SVGProps<SVGSVGElement>>;
}

export function InputField({ size, type, icon, placeholder }: InputFieldProps) {
  return (
    <TextInput
      applyTheme={{
        field: {
          input: {
            base: "replace",
            colors: {
              gray: "replace",
            },
          },
        },
      }}
      theme={{
        field: {
          input: {
            colors: {
              gray: "bg-background1 border-border1 focus:ring-0 placeholder-gray-500",
            },
          },
        },
      }}
      placeholder={placeholder}
      icon={icon}
      className="rounded-md text-text2 "
      type={type}
      sizing={size}
    />
  );
}
