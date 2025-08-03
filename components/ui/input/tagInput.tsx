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
  const keypressEvt = (e: any) => {
    if (e.key == "Enter" || e.key == ",") {
      if (e.currentTarget && e.currentTarget?.textContent?.length! > 0) {
        setTags((prevTags) => {
          let isOverlap = false;
          for (let i = 0; i < prevTags.length; i++) {
            if (prevTags[i] == e.currentTarget?.textContent) {
              isOverlap = true;
              break;
            }
          }

          if (isOverlap) {
            (e.target as HTMLElement).innerText = "";
            return prevTags;
          }

          let newTags = [...prevTags];
          newTags.push((e.target as HTMLElement).innerText);
          (e.target as HTMLElement).innerText = "";
          return newTags;
        });
      }
      e.preventDefault();
    }
  };
  const [tags, setTags] = useState<string[]>([]);
  const [isFocus, setFocus] = useState<boolean>(false);
  const [placeHolder, setPlaceHolder] = useState<string>(
    "태그 입력후 엔터나 쉼표를 눌러보세요."
  );
  useEffect(() => {}, []);
  useEffect(() => {
    setTags(defaultValue ? defaultValue : []);
  }, [defaultValue]);
  //   useEffect(() => {
  //     if (tags.length <= 0) {
  //       let inputItem = document.getElementById("tagInputItem") as HTMLElement;
  //       keyupEvt(inputItem);
  //     }
  //   }, [tags]);
  //   const keyupEvt = (target: any) => {
  //     if (target.innerText.length! <= 0 && tags.length <= 0) {
  //       console.log("??");
  //       setPlaceHolder("태그를 입력하세요");
  //     } else {
  //       setPlaceHolder(`\u200b`);
  //     }
  //   };
  return (
    <div
      id="tagInputWrapper"
      className="w-full h-full flex flex-wrap gap-2 flex-grow"
    >
      {tags.map((v, i) => {
        console.log(v);
        return (
          <TagItem
            mode="normal"
            clickEvt={() => {
              setTags((prevTags) => {
                let newTags = [...prevTags];
                newTags.splice(i, 1);
                return newTags;
              });
            }}
            text={v}
            key={i}
          />
        );
      })}
      <input
        id="tagInputItem"
        onKeyDown={(e: any) => {
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
                let isOverlap = false;
                for (let i = 0; i < prevTags.length; i++) {
                  if (prevTags[i] == e.target?.value) {
                    isOverlap = true;
                    break;
                  }
                }

                if (isOverlap) {
                  e.target.value = "";
                  return prevTags;
                }

                let newTags = [...prevTags];
                newTags.push(e.target.value);
                e.target.value = "";
                return newTags;
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
