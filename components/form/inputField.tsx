import { Label, TextInput } from "flowbite-react";
import { InputFieldType } from "./formType";

export function InputField({ size, type, icon }: InputFieldType) {
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
              gray: "bg-background1 border-border1",
            },
          },
        },
      }}
      icon={icon}
      className="rounded-md text-text2 "
      type={type}
      sizing={size}
    />
  );
}
