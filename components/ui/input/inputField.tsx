import { TextInput } from "flowbite-react";
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
            base: "replace", // 기본 스타일 싹 교체
            colors: {
              gray: "replace",
            },
            withAddon: {
              off: "replace",
            },
          },
        },
      }}
      theme={{
        field: {
          input: {
            colors: {
              gray:
                "border-0 border-b-[1px] border-border1 rounded-none " + // ✅ 둥근 모서리 제거
                "bg-transparent focus:border-cyan-500 focus:ring-0 placeholder-gray-500 " +
                className,
            },
            withAddon: {
              off: "rounded-none",
            },
          },
        },
      }}
      {...rest}
      icon={icon}
      className="text-text2 focus:outline-none rounded-none" // ✅ radius 완전 제거
      type={type}
      sizing={size}
    />
  );
}

export default memo(InputField);
