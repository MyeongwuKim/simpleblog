"use client";

import { useCallback, useDeferredValue, useRef, useState } from "react";
import TagItem from "../items/tagItem";
import TagSuggestionPopup from "@/components/popup/tagSuggestion";
import { useQuery } from "@tanstack/react-query";

const TagInput = ({
  callback,
  tags,
  className,
}: {
  callback?: (tags: string[]) => void;
  tags: string[];
  className?: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ 컨트롤드 인풋 상태
  const [input, setInput] = useState("");
  const [isComposit, setIsComposit] = useState(false);

  const deferredInput = useDeferredValue(input);

  const addTag = useCallback(() => {
    const value = input.trim();
    if (!value || tags.includes(value)) return;
    callback?.([...tags, value]);
    setInput(""); // 컨트롤드라 상태 초기화
    // 포커스 유지
    inputRef.current?.focus();
  }, [tags, callback, input]);

  const removeTag = useCallback(
    (index: number) => {
      callback?.(tags.filter((_, i) => i !== index));
    },
    [tags, callback]
  );

  // ✅ 자동완성: 조합 중에는 호출 안 함, 2자 이상부터
  const { data: tagData, isLoading } = useQuery<QueryResponse<{ body: string }[]>>({
    queryKey: ["tag", deferredInput],
    queryFn: async () => {
      const q = deferredInput.trim();
      if (q.length < 2) return { data: [] };
      const res = await fetch(`/api/tag/search?q=${encodeURIComponent(q)}`);
      return res.json();
    },
    enabled: deferredInput.trim().length >= 2,
  });

  const suggestions = tagData?.data?.map((t) => t.body) ?? [];
  const hasSuggestions = suggestions.length > 0;

  return (
    <div id="tagInputWrapper" className={`relative flex flex-wrap gap-2 items-center ${className ?? ""}`}>
      {tags.map((v, i) => (
        <TagItem id="" mode="normal" clickEvt={() => removeTag(i)} text={v} key={`${v}-${i}`} />
      ))}

      <div className="relative">
        <input
          ref={inputRef}
          id="tagInputItem"
          value={input}
          onChange={(e) => {
            // 조합 중에도 화면 값은 업데이트해도 됨 (호출은 enabled로 막음)
            setInput(e.target.value);
          }}
          onCompositionStart={() => setIsComposit(true)}
          onCompositionEnd={(e) => {
            setIsComposit(false);
            const val = (e.target as HTMLInputElement).value; // or e.currentTarget.value
            setInput(val);
          }}
          onKeyDown={(e) => {
            if (isComposit) return;

            if (e.key === "Backspace") {
              if (input.length <= 0 && tags.length > 0) {
                removeTag(tags.length - 1);
                e.preventDefault();
              }
            } else if (e.key == "Enter" || e.key == ",") {
              const value = inputRef.current?.value.trim();
              if (value) {
                setInput("");
                addTag(); // 값이 있으면 addTag 호출
              }
              e.preventDefault();
            }
          }}
          placeholder="태그를 입력하세요."
          className="flex-grow inline-flex min-w-[8rem] h-[34px] outline-none bg-transparent text-text1 max-w-[192px]"
        />

        {/* ✅ 팝업: API 결과를 사용 */}
        <div className="absolute left-0 top-full mt-2 w-auto z-10">
          <TagSuggestionPopup
            visible={!isLoading && hasSuggestions}
            suggestions={suggestions}
            onSelectItem={(value) => {
              setInput("");
              inputRef.current?.focus();
              callback?.([...tags, value]);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TagInput;
