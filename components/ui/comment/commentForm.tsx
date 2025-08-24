"use client";
import DefButton from "../buttons/defButton";
import InputField from "../input/inputField";

import { TextAreaField } from "../input/textAreaField";

export default function CommentForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-auto">
        <InputField size="md" placeholder="이름" type="text"></InputField>
      </div>
      <div className="h-[98px]">
        <TextAreaField placeholder="댓글 입력" />
      </div>
      <div className="w-full  h-[45px]">
        <div className="w-[120px] h-[45px]  absolute right-0">
          <DefButton
            type="submit"
            className="hover:bg-bg-page3 text-cyan-500"
            btnColor="black"
            innerItem={"댓글 작성"}
          />
        </div>
      </div>
    </form>
  );
}
