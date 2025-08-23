import { Textarea } from "flowbite-react";

import { TextareaHTMLAttributes } from "react";

interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {}

export function TextAreaField({ ...rest }: TextAreaProps) {
  return (
    <Textarea
      {...rest}
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
      className="rounded-md text-text2 focus:outline-0 w-full h-full"
    />
  );
}
