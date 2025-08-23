import { Label, TextInput } from "flowbite-react";
import { TextInputSizes } from "flowbite-react";
import { DynamicStringEnumKeysOf } from "flowbite-react/types";
import React, {
  FC,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  memo,
  SVGProps,
} from "react";

interface InputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  type: HTMLInputTypeAttribute;
  size: DynamicStringEnumKeysOf<TextInputSizes>;
  icon?: FC<SVGProps<SVGSVGElement>>;
  className?: string;
}

function InputField({
  size,
  type,
  icon,
  className = "",
  ...rest
}: InputFieldProps) {
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
              gray:
                "bg-background1 border-border1 focus:ring-0 placeholder-gray-500 " +
                className,
            },
          },
        },
      }}
      {...rest}
      icon={icon}
      className="rounded-md text-text2 "
      type={type}
      sizing={size}
    />
  );
}

export default memo(InputField);
