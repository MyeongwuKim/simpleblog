"use client";

import { useCallback, useRef, useState } from "react";
import TagItem from "../items/tagItem";

const TagInput = ({
  callback,
  tags,
}: {
  callback?: (tags: string[]) => void;
  tags: string[];
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isComposit, setIsComposit] = useState<boolean>(false);

  const addTag = useCallback(() => {
    if (!inputRef.current) return;
    const value = inputRef.current.value.trim();
    if (!value || tags.includes(value)) return;

    callback?.([...tags, value]);
    inputRef.current.value = "";
  }, [tags, callback]);

  const removeTag = useCallback(
    (index: number) => {
      callback?.(tags.filter((_, i) => i !== index));
    },
    [tags, callback]
  );

  return (
    <div
      id="tagInputWrapper"
      className="w-full h-full flex flex-wrap gap-2 flex-grow"
    >
      {tags.map((v, i) => {
        return (
          <TagItem
            id=""
            mode="normal"
            clickEvt={() => removeTag(i)}
            text={v}
            key={i}
          />
        );
      })}
      <input
        ref={inputRef}
        onBlur={() => {
          const value = inputRef.current?.value.trim();
          if (value) {
            addTag(); // 값이 있으면 addTag 호출
          }
        }}
        id="tagInputItem"
        onCompositionEnd={() => setIsComposit(false)}
        onCompositionStart={() => setIsComposit(true)}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (isComposit) return;
          if (e.key == "Backspace") {
            if (e.currentTarget.value.length <= 0 && tags.length > 0) {
              removeTag(tags.length - 1);
              e.preventDefault();
            }
          } else if (e.key == "Enter") {
            const value = inputRef.current?.value.trim();
            if (value) {
              addTag(); // 값이 있으면 addTag 호출
            }
            e.preventDefault();
          }
        }}
        placeholder={"태그를 입력하세요."}
        className="flex-grow inline-flex min-w-[8rem] h-[34px]  outline-none break-words bg-transparent   text-text1 "
      />
    </div>
  );
};

export default TagInput;
