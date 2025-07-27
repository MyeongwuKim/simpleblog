import { Textarea } from "flowbite-react";
import { inputFieldType } from "./formType";

interface TextAreaProps extends inputFieldType {}

export function TextAreaField({ placeholder }: TextAreaProps) {
  return (
    <Textarea
      applyTheme={{
        colors: {
          gray: "replace",
        },
      }}
      theme={{
        base: "focus:ring-0 resize-none outline-none",
        colors: {
          gray: "text-text1 placeholder-gray-500  bg-background1 border-border1",
        },
      }}
      placeholder={placeholder}
      className="rounded-md text-text2 focus:outline-0 w-full h-full"
    />
  );
}
