"use client";

import { useEffect, useState } from "react";
import TagItem from "../items/tagItem";

const TagInput = ({
  callback,
  defaultValue,
}: {
  callback?: (tags: string[]) => void;
  defaultValue?: string[];
}) => {
  const [tags, setTags] = useState<string[]>([]);
  const [isComposit, setIsComposit] = useState<boolean>(false);
  const [placeHolder, setPlaceHolder] = useState<string>(
    "태그 입력후 엔터나 쉼표를 눌러보세요."
  );
  useEffect(() => {
    if (callback) callback(tags);
  }, [tags]);
  useEffect(() => {
    setTags(defaultValue ? defaultValue : []);
  }, [defaultValue]);

  return (
    <div
      id="tagInputWrapper"
      className="w-full h-full flex flex-wrap gap-2 flex-grow"
    >
      {tags.map((v, i) => {
        return (
          <TagItem
            mode="normal"
            clickEvt={() =>
              setTags((prevTags) => prevTags.filter((_, index) => index !== i))
            }
            text={v}
            key={i}
          />
        );
      })}
      <input
        id="tagInputItem"
        onCompositionEnd={() => setIsComposit(false)}
        onCompositionStart={() => setIsComposit(true)}
        onKeyDown={(e: any) => {
          if (isComposit) return;
          if (e.key == "Backspace") {
            if (e.target?.value?.length! <= 0 && tags.length > 0) {
              setTags((prevTags) => {
                let newTags = [...prevTags];
                newTags.pop();
                return newTags;
              });
              e.preventDefault();
            }
          } else if (e.key == "Enter") {
            if (e.target && e.target?.value?.length! > 0) {
              setTags((prevTags) => {
                const value = e.target?.value?.trim();
                if (!value || prevTags.includes(value)) {
                  e.target.value = "";
                  return prevTags;
                }
                e.target.value = "";
                return [...prevTags, value];
              });
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
