"use client";
import { SetStateAction, useState, Dispatch as StateDispatch } from "react";
import { FaGithub, FaInstagram } from "react-icons/fa6";
import LabelButton from "../buttons/labelButton";
import InputField from "../input/inputField";
import DefButton from "../buttons/defButton";

export default function SocialForm() {
  let [isModify, setIsModify] = useState<boolean>(false);
  return (
    <div className="w-full h-auto ">
      <div className="w-full h-auto relative pb-8 flex border-b-[1px] border-border1">
        <div className="max-w-[163px] w-full">
          <h3 className="text-text1 text-xl font-bold w-full">소셜설정</h3>
        </div>
        {isModify ? (
          <EditSocialForm setState={setIsModify} />
        ) : (
          <div id="sub-setting-view" className="flex relative w-full  gap-2">
            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex text-text3 gap-2 items-center">
                <FaGithub className="w-4 h-4" />
                <span>www.naver.com</span>
              </div>
              <div className="w-full flex text-text3 gap-2 items-center">
                <FaGithub className="w-4 h-4" />
                <span>www.naver.com</span>
              </div>
            </div>

            <div className="w-[40px]">
              <LabelButton
                color="cyan"
                className="underline h-full w-full"
                innerItem="수정"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type SubFromType = {
  setState: StateDispatch<SetStateAction<boolean>>;
};
function EditSocialForm({ setState }: SubFromType) {
  return (
    <form id="sub-form" className="flex gap-4 flex-col w-2/4">
      <InputField size="md" type="text" icon={FaGithub}></InputField>
      <InputField size="md" type="text" icon={FaInstagram}></InputField>
      <div className="flex flex-row-reverse">
        <div className="w-[100px] h-[40px]">
          <DefButton
            type="submit"
            className="hover:bg-bg-page3"
            btnColor="black"
            innerItem="확인"
            onClickEvt={() => {
              setState(false);
            }}
          />
        </div>
      </div>
    </form>
  );
}
