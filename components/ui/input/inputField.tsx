"use client";

import { TextInput } from "flowbite-react";
import { TextInputSizes } from "flowbite-react";
import { DynamicStringEnumKeysOf } from "flowbite-react/types";
import React, {
  FC,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  memo,
  SVGProps,
  forwardRef,
} from "react";

interface InputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  type: HTMLInputTypeAttribute;
  size: DynamicStringEnumKeysOf<TextInputSizes>;
  icon?: FC<SVGProps<SVGSVGElement>>;
  className?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ size, type, icon, className = "", ...rest }, ref) => {
    return (
      <TextInput
        ref={ref} // ✅ 여기
        sizing={size}
        applyTheme={{
          field: {
            input: {
              base: "replace",
              colors: {
                gray: "replace",
              },
              withAddon: {
                off: "replace",
              },
              sizes: {
                sm: "replace",
                md: "replace",
                lg: "replace",
              },
            },
          },
        }}
        theme={{
          field: {
            input: {
              colors: {
                gray:
                  "border-0 text-2xl border-b-[1px] border-border1 rounded-none " +
                  "bg-transparent focus:border-cyan-500 focus:ring-0 placeholder-gray-500 ",
              },
              withAddon: {
                off: "rounded-none",
              },
              sizes: {
                sm: "text-base py-2",
                md: "text-xl py-2",
                lg: "text-3xl py-2",
              },
            },
          },
        }}
        {...rest}
        icon={icon}
        className={`text-text2 focus:outline-none rounded-none ${className}`}
        type={type}
      />
    );
  }
);

InputField.displayName = "InputField";

export default memo(InputField);
